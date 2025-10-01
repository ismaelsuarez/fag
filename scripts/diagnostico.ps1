# Script de Diagnóstico - Ecommerce Farmacia
# Verifica que todo esté configurado correctamente

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DIAGNÓSTICO ECOMMERCE FARMACIA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Node.js
Write-Host "[1/10] Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node -v 2>$null
if ($nodeVersion) {
    Write-Host "  ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeMajor -ge 20) {
        Write-Host "  ✓ Versión correcta (>=20)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Versión incorrecta. Se requiere Node >= 20" -ForegroundColor Red
    }
} else {
    Write-Host "  ✗ Node.js NO instalado" -ForegroundColor Red
}
Write-Host ""

# 2. Verificar pnpm
Write-Host "[2/10] Verificando pnpm..." -ForegroundColor Yellow
$pnpmVersion = pnpm -v 2>$null
if ($pnpmVersion) {
    Write-Host "  ✓ pnpm instalado: $pnpmVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ pnpm NO instalado. Ejecuta: npm install -g pnpm" -ForegroundColor Red
}
Write-Host ""

# 3. Verificar Docker
Write-Host "[3/10] Verificando Docker..." -ForegroundColor Yellow
$dockerVersion = docker -v 2>$null
if ($dockerVersion) {
    Write-Host "  ✓ Docker instalado: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Docker NO instalado" -ForegroundColor Red
}
Write-Host ""

# 4. Verificar archivos .env
Write-Host "[4/10] Verificando archivos .env..." -ForegroundColor Yellow
$envFiles = @(
    "apps\api\.env",
    "apps\storefront\.env.local",
    "apps\admin\.env.local"
)
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file existe" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file NO existe" -ForegroundColor Red
    }
}
Write-Host ""

# 5. Verificar node_modules
Write-Host "[5/10] Verificando dependencias instaladas..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ node_modules/ existe en raíz" -ForegroundColor Green
} else {
    Write-Host "  ✗ node_modules/ NO existe. Ejecuta: pnpm install" -ForegroundColor Red
}
Write-Host ""

# 6. Verificar Docker containers
Write-Host "[6/10] Verificando contenedores Docker..." -ForegroundColor Yellow
$containers = docker ps --format "{{.Names}}" 2>$null
if ($containers -match "ecom-db") {
    Write-Host "  ✓ PostgreSQL (ecom-db) está corriendo" -ForegroundColor Green
} else {
    Write-Host "  ✗ PostgreSQL (ecom-db) NO está corriendo" -ForegroundColor Yellow
    Write-Host "    Ejecuta: docker compose up -d db" -ForegroundColor Gray
}
if ($containers -match "ecom-redis") {
    Write-Host "  ✓ Redis (ecom-redis) está corriendo" -ForegroundColor Green
} else {
    Write-Host "  ✗ Redis (ecom-redis) NO está corriendo" -ForegroundColor Yellow
    Write-Host "    Ejecuta: docker compose up -d redis" -ForegroundColor Gray
}
Write-Host ""

# 7. Verificar puertos disponibles
Write-Host "[7/10] Verificando puertos..." -ForegroundColor Yellow
$ports = @(3000, 3001, 3002, 5432, 6379)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -InformationLevel Quiet
    if ($connection) {
        Write-Host "  ⚠ Puerto $port está EN USO" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ Puerto $port está LIBRE" -ForegroundColor Green
    }
}
Write-Host ""

# 8. Verificar API
Write-Host "[8/10] Verificando API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/health" -UseBasicParsing -TimeoutSec 3 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ API respondiendo correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ API NO está respondiendo" -ForegroundColor Yellow
    Write-Host "    Ejecuta: pnpm dev:api" -ForegroundColor Gray
}
Write-Host ""

# 9. Verificar Storefront
Write-Host "[9/10] Verificando Storefront..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Storefront respondiendo correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Storefront NO está respondiendo" -ForegroundColor Yellow
    Write-Host "    Ejecuta: pnpm dev:storefront" -ForegroundColor Gray
}
Write-Host ""

# 10. Verificar credenciales importantes
Write-Host "[10/10] Verificando configuración..." -ForegroundColor Yellow
$envContent = Get-Content "apps\api\.env" -Raw -ErrorAction SilentlyContinue
if ($envContent) {
    if ($envContent -match "ZETTI_CLIENT_ID=\w+") {
        Write-Host "  ✓ Credenciales Zetti configuradas" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Credenciales Zetti NO configuradas" -ForegroundColor Yellow
        Write-Host "    Completa ZETTI_* en apps/api/.env" -ForegroundColor Gray
    }
    
    if ($envContent -match "MP_ACCESS_TOKEN=\w+") {
        Write-Host "  ✓ Token Mercado Pago configurado" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Token Mercado Pago NO configurado" -ForegroundColor Yellow
        Write-Host "    Completa MP_ACCESS_TOKEN en apps/api/.env" -ForegroundColor Gray
    }
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FIN DEL DIAGNÓSTICO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para más información, consulta: GUIA_ARRANQUE.md" -ForegroundColor Cyan

