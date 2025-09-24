import { Module } from '@nestjs/common';

import { AppController } from '../presentation/http/app.controller';
import { AppService } from '../services/app.service';
import { AppConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import { UsersModule } from './users/users.module';
import { QueuesModule } from '../queues/queues.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    ...(process.env.NODE_ENV === 'test' ? [] : [QueuesModule]),
    AuthModule,
    UsersModule,
    CatalogModule,
    CartModule,
    CheckoutModule,
    PaymentsModule,
    OrdersModule,
    PrescriptionsModule,
    SearchModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}


