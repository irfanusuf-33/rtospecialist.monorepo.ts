import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/product.module';
import { CategoriesModule } from './category/category.module';
import { SubcategoriesModule } from './subcategory/subcategory.module';
import { PdevProductCategoryModule } from './pdevCoursesCategory/course-category.module';
import { AdminsModule } from './admin/category.module';
import { PdevProductsModule } from './pdevProduct/pdevProduct.module';
import { AffiliateUserModule } from './affiliate-user/affiliate-user.module';
import { AppointmentsModule } from './appointment/appointment.module';
import { PdevProductCourseResultsModule } from './pdev-product-course-results/pdev-product-course-results.module';
import { PdevUsersModule } from './pdev-user/pdev-user.module';
import { HelpAndSupportModule } from './help-and-support/help-and-support.module';
import { OrdersModule } from './orders/orders.module';
import { CouponsModule } from './coupons/coupons.module';
import { CartsModule } from './carts/carts.module';
import { LogsModule } from './log-trails/log-trails.module';
import { MembershipsModule } from './memberships/memberships.module';
import { StripeModule } from './stripe/stripe.module';
import { MigrationModule } from './migration/migration.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PaymentsModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, UsersModule, PrismaModule, ProductsModule, SubcategoriesModule, CategoriesModule, AdminsModule, PdevProductCategoryModule,
    PdevProductsModule,
    AffiliateUserModule,
    AppointmentsModule,
    PdevProductCourseResultsModule,
    PdevUsersModule,
    HelpAndSupportModule,
    OrdersModule,
    CouponsModule,
    CartsModule,
    LogsModule,
    MembershipsModule,
    StripeModule,
    MigrationModule,
    CheckoutModule,
    PaymentsModule,
  ],
})
export class AppModule {}