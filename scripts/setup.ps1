# Script de Setup Automatizado - Ecommerce Farmacia
# Este script automatiza los pasos iniciales de configuración

param(
    [switch]$SkipInstall = $false,
    [switch]$SkipDocker = $false,
    [switch]$SkipMigrations = $false
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SETUP ECOMMERCE FARMACIA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"
$projectRoot = (Get-Location).Path

# Verificar Node.js
Write-Host "[1/8] Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node -v 2>$null
if (!$nodeVersion) {
    Write-Host "  ✗ Node.js NO instalado. Instálalo desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}
$nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajor -lt 20) {
    Write-Host "  ✗ Node.js versión $nodeVersion. Se requiere >= 20" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Node.js $nodeVersion" -ForegroundColor Green
Write-Host ""

# Verificar pnpm
Write-Host "[2/8] Verificando pnpm..." -ForegroundColor Yellow
$pnpmVersion = pnpm -v 2>$null
if (!$pnpmVersion) {
    Write-Host "  ✗ pnpm NO instalado. Instalando..." -ForegroundColor Yellow
    npm install -g pnpm
    Write-Host "  ✓ pnpm instalado" -ForegroundColor Green
} else {
    Write-Host "  ✓ pnpm $pnpmVersion" -ForegroundColor Green
}
Write-Host ""

# Verificar Docker
Write-Host "[3/8] Verificando Docker..." -ForegroundColor Yellow
$dockerVersion = docker -v 2>$null
if (!$dockerVersion) {
    Write-Host "  ✗ Docker NO instalado. Instálalo desde https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Docker instalado" -ForegroundColor Green
Write-Host ""

# Instalar dependencias
if (!$SkipInstall) {
    Write-Host "[4/8] Instalando dependencias..." -ForegroundColor Yellow
    Write-Host "  (esto puede tomar varios minutos)" -ForegroundColor Gray
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "[4/8] Saltando instalación de dependencias (--SkipInstall)" -ForegroundColor Yellow
}
Write-Host ""

# Levantar Docker
if (!$SkipDocker) {
    Write-Host "[5/8] Levantando servicios Docker..." -ForegroundColor Yellow
    docker compose up -d db redis
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Error al levantar Docker" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ PostgreSQL y Redis levantados" -ForegroundColor Green
    Write-Host "  Esperando 5 segundos para que los servicios estén listos..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
} else {
    Write-Host "[5/8] Saltando Docker (--SkipDocker)" -ForegroundColor Yellow
}
Write-Host ""

# Verificar archivos .env
Write-Host "[6/8] Verificando archivos .env..." -ForegroundColor Yellow
$envCreated = $false

if (!(Test-Path "apps\api\.env")) {
    Copy-Item "apps\api\env.example" "apps\api\.env"
    Write-Host "  ✓ Creado apps\api\.env" -ForegroundColor Green
    $envCreated = $true
} else {
    Write-Host "  ✓ apps\api\.env ya existe" -ForegroundColor Green
}

if (!(Test-Path "apps\storefront\.env.local")) {
    Copy-Item "apps\storefront\env.example" "apps\storefront\.env.local"
    Write-Host "  ✓ Creado apps\storefront\.env.local" -ForegroundColor Green
    $envCreated = $true
} else {
    Write-Host "  ✓ apps\storefront\.env.local ya existe" -ForegroundColor Green
}

if (!(Test-Path "apps\admin\.env.local")) {
    'NEXT_PUBLIC_API_URL=http://localhost:3002/api' | Set-Content "apps\admin\.env.local"
    Write-Host "  ✓ Creado apps\admin\.env.local" -ForegroundColor Green
    $envCreated = $true
} else {
    Write-Host "  ✓ apps\admin\.env.local ya existe" -ForegroundColor Green
}

if ($envCreated) {
    Write-Host ""
    Write-Host "  ⚠️  IMPORTANTE: Edita apps\api\.env y completa:" -ForegroundColor Yellow
    Write-Host "     - JWT_SECRET (cambiar por un string largo)" -ForegroundColor Yellow
    Write-Host "     - ZETTI_* (credenciales ERP)" -ForegroundColor Yellow
    Write-Host "     - MP_ACCESS_TOKEN (token Mercado Pago TEST)" -ForegroundColor Yellow
    Write-Host ""
}
Write-Host ""

# Ejecutar migraciones
if (!$SkipMigrations) {
    Write-Host "[7/8] Ejecutando migraciones..." -ForegroundColor Yellow
    Push-Location "$projectRoot\apps\api"
    
    # Esperar un poco más si Docker acaba de levantarse
    if (!$SkipDocker) {
        Write-Host "  Esperando conexión a base de datos..." -ForegroundColor Gray
        Start-Sleep -Seconds 3
    }
    
    $retries = 3
    $success = $false
    for ($i = 1; $i -le $retries; $i++) {
        Write-Host "  Intento $i de $retries..." -ForegroundColor Gray
        pnpm migration:run 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $success = $true
            break
        }
        if ($i -lt $retries) {
            Write-Host "  Reintentando en 3 segundos..." -ForegroundColor Gray
            Start-Sleep -Seconds 3
        }
    }
    
    if (!$success) {
        Write-Host "  ✗ Error al ejecutar migraciones" -ForegroundColor Red
        Write-Host "  Verifica que PostgreSQL esté corriendo: docker ps" -ForegroundColor Yellow
        Pop-Location
        exit 1
    }
    Write-Host "  ✓ Migraciones ejecutadas" -ForegroundColor Green
    
    # Ejecutar seed
    Write-Host "  Cargando datos de prueba..." -ForegroundColor Gray
    pnpm seed 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Datos de prueba cargados" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Error al cargar datos de prueba (no crítico)" -ForegroundColor Yellow
    }
    
    Pop-Location
} else {
    Write-Host "[7/8] Saltando migraciones (--SkipMigrations)" -ForegroundColor Yellow
}
Write-Host ""

# Build inicial
Write-Host "[8/8] Build inicial de paquetes..." -ForegroundColor Yellow
pnpm build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build completado" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Algunos builds fallaron (puede que ya existan)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ SETUP COMPLETADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edita apps\api\.env y completa las credenciales necesarias" -ForegroundColor White
Write-Host ""
Write-Host "2. Arranca las aplicaciones:" -ForegroundColor White
Write-Host "   pnpm dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Verifica que todo funcione:" -ForegroundColor White
Write-Host "   - API: http://localhost:3002/api/health" -ForegroundColor Gray
Write-Host "   - Swagger: http://localhost:3002/api/docs" -ForegroundColor Gray
Write-Host "   - Storefront: http://localhost:3000" -ForegroundColor Gray
Write-Host "   - Admin: http://localhost:3001" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Ejecuta el diagnóstico:" -ForegroundColor White
Write-Host "   .\scripts\diagnostico.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentación:" -ForegroundColor Cyan
Write-Host "   GUIA_ARRANQUE.md - Guía completa" -ForegroundColor Gray
Write-Host "   CHECKLIST.md - Checklist paso a paso" -ForegroundColor Gray
Write-Host ""

