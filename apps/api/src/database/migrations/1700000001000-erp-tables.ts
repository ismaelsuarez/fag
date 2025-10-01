import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class ErpTables1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // erp_products
    await queryRunner.createTable(
      new Table({
        name: 'erp_products',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'externalId', type: 'varchar', isUnique: true },
          { name: 'name', type: 'varchar', isNullable: true },
          { name: 'brand', type: 'varchar', isNullable: true },
          { name: 'category', type: 'varchar', isNullable: true },
          { name: 'isPrescription', type: 'boolean', default: false },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );

    // erp_skus
    await queryRunner.createTable(
      new Table({
        name: 'erp_skus',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'productId', type: 'uuid' },
          { name: 'externalId', type: 'varchar', isUnique: true },
          { name: 'code', type: 'varchar', isNullable: true },
          { name: 'barcode', type: 'varchar', isNullable: true },
          { name: 'presentation', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'erp_skus',
      new TableForeignKey({ columnNames: ['productId'], referencedTableName: 'erp_products', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );

    // erp_branch_stock
    await queryRunner.createTable(
      new Table({
        name: 'erp_branch_stock',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'skuId', type: 'uuid' },
          { name: 'branchId', type: 'varchar' },
          { name: 'price', type: 'numeric' },
          { name: 'currency', type: 'varchar', default: "'ARS'" },
          { name: 'stock', type: 'int', default: 0 },
          { name: 'stockReserved', type: 'int', default: 0 }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'erp_branch_stock',
      new TableForeignKey({ columnNames: ['skuId'], referencedTableName: 'erp_skus', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );
    await queryRunner.createIndex(
      'erp_branch_stock',
      new TableIndex({ name: 'IDX_branch_sku', columnNames: ['branchId', 'skuId'], isUnique: false })
    );

    // erp_product_images
    await queryRunner.createTable(
      new Table({
        name: 'erp_product_images',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'productId', type: 'uuid' },
          { name: 'url', type: 'varchar' },
          { name: 'isThumbnail', type: 'boolean', default: false },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'erp_product_images',
      new TableForeignKey({ columnNames: ['productId'], referencedTableName: 'erp_products', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('erp_product_images');
    await queryRunner.dropTable('erp_branch_stock');
    await queryRunner.dropTable('erp_skus');
    await queryRunner.dropTable('erp_products');
  }
}


