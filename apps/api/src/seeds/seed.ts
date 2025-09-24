import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ProductEntity } from '../entities/product.entity';
import { ProductVariantEntity } from '../entities/product_variant.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const users = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  const products = app.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
  const variants = app.get<Repository<ProductVariantEntity>>(getRepositoryToken(ProductVariantEntity));

  // user
  const existing = await users.findOne({ where: { email: 'demo@local' } });
  if (!existing) {
    await users.save(users.create({ email: 'demo@local', passwordHash: 'hash', role: 'admin' }));
  }

  // products
  const p1 = products.create({ name: 'Ibuprofeno 400mg', slug: 'ibuprofeno-400', rxRequired: false });
  await products.save(p1);
  await variants.save(variants.create({ product: p1, sku: 'IBU-400', barcode: '123' }));

  const p2 = products.create({ name: 'Amoxicilina 500mg', slug: 'amoxicilina-500', rxRequired: true });
  await products.save(p2);
  await variants.save(variants.create({ product: p2, sku: 'AMO-500', barcode: '456' }));

  await app.close();
}

bootstrap().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


