import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Initial1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";");
    // users
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isNullable: false, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'passwordHash', type: 'varchar' },
          { name: 'role', type: 'varchar', default: "'customer'" },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      }),
      true
    );

    // customers
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'user_id', type: 'uuid', isNullable: true },
          { name: 'fullName', type: 'varchar' },
          { name: 'documentId', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      }),
      true
    );
    await queryRunner.createForeignKey(
      'customers',
      new TableForeignKey({ columnNames: ['user_id'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'SET NULL' })
    );

    // addresses
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'customerId', type: 'uuid' },
          { name: 'line1', type: 'varchar' },
          { name: 'line2', type: 'varchar', isNullable: true },
          { name: 'city', type: 'varchar' },
          { name: 'province', type: 'varchar' },
          { name: 'country', type: 'varchar' },
          { name: 'postalCode', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'addresses',
      new TableForeignKey({ columnNames: ['customerId'], referencedTableName: 'customers', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );

    // branches
    await queryRunner.createTable(
      new Table({
        name: 'branches',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'code', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );

    // products
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'rxRequired', type: 'boolean', default: false },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );

    // product_variants
    await queryRunner.createTable(
      new Table({
        name: 'product_variants',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'productId', type: 'uuid' },
          { name: 'sku', type: 'varchar' },
          { name: 'barcode', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'product_variants',
      new TableForeignKey({ columnNames: ['productId'], referencedTableName: 'products', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );

    // stock_items
    await queryRunner.createTable(
      new Table({
        name: 'stock_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'branchId', type: 'uuid' },
          { name: 'variantId', type: 'uuid' },
          { name: 'quantity', type: 'int' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'stock_items',
      new TableForeignKey({ columnNames: ['branchId'], referencedTableName: 'branches', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );
    await queryRunner.createForeignKey(
      'stock_items',
      new TableForeignKey({ columnNames: ['variantId'], referencedTableName: 'product_variants', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );

    // prices
    await queryRunner.createTable(
      new Table({
        name: 'prices',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'variantId', type: 'uuid' },
          { name: 'amount', type: 'numeric' },
          { name: 'currency', type: 'varchar', default: "'ARS'" },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'prices',
      new TableForeignKey({ columnNames: ['variantId'], referencedTableName: 'product_variants', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );

    // carts
    await queryRunner.createTable(
      new Table({
        name: 'carts',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'customerId', type: 'uuid', isNullable: true },
          { name: 'items', type: 'jsonb', default: "'[]'::jsonb" },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'carts',
      new TableForeignKey({ columnNames: ['customerId'], referencedTableName: 'customers', referencedColumnNames: ['id'], onDelete: 'SET NULL' })
    );

    // orders
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'customerId', type: 'uuid', isNullable: true },
          { name: 'status', type: 'varchar', default: "'pending'" },
          { name: 'totalAmount', type: 'numeric', default: 0 },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({ columnNames: ['customerId'], referencedTableName: 'customers', referencedColumnNames: ['id'], onDelete: 'SET NULL' })
    );

    // order_items
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'orderId', type: 'uuid' },
          { name: 'variantId', type: 'uuid' },
          { name: 'quantity', type: 'int' },
          { name: 'unitPrice', type: 'numeric' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({ columnNames: ['orderId'], referencedTableName: 'orders', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({ columnNames: ['variantId'], referencedTableName: 'product_variants', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );

    // payments
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'orderId', type: 'uuid' },
          { name: 'provider', type: 'varchar', default: "'mp'" },
          { name: 'status', type: 'varchar', default: "'pending'" },
          { name: 'externalId', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({ columnNames: ['orderId'], referencedTableName: 'orders', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );

    // invoices
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'orderId', type: 'uuid' },
          { name: 'provider', type: 'varchar', default: "'afip'" },
          { name: 'cae', type: 'varchar', isNullable: true },
          { name: 'externalId', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({ columnNames: ['orderId'], referencedTableName: 'orders', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );

    // prescriptions
    await queryRunner.createTable(
      new Table({
        name: 'prescriptions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'customerId', type: 'uuid', isNullable: true },
          { name: 'fileUrl', type: 'varchar', isNullable: true },
          { name: 'status', type: 'varchar', default: "'pending'" },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'prescriptions',
      new TableForeignKey({ columnNames: ['customerId'], referencedTableName: 'customers', referencedColumnNames: ['id'], onDelete: 'SET NULL' })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prescriptions');
    await queryRunner.dropTable('invoices');
    await queryRunner.dropTable('payments');
    await queryRunner.dropTable('order_items');
    await queryRunner.dropTable('orders');
    await queryRunner.dropTable('carts');
    await queryRunner.dropTable('prices');
    await queryRunner.dropTable('stock_items');
    await queryRunner.dropTable('product_variants');
    await queryRunner.dropTable('products');
    await queryRunner.dropTable('branches');
    await queryRunner.dropTable('addresses');
    await queryRunner.dropTable('customers');
    await queryRunner.dropTable('users');
  }
}


