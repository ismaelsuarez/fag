import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZettiClient } from './zetti.client';
import { ErpProduct } from './domain/erp_product.entity';
import { ErpSku } from './domain/erp_sku.entity';
import { ErpBranchStock } from './domain/erp_branch_stock.entity';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(
    private readonly zetti: ZettiClient,
    @InjectRepository(ErpProduct) private readonly products: Repository<ErpProduct>,
    @InjectRepository(ErpSku) private readonly skus: Repository<ErpSku>,
    @InjectRepository(ErpBranchStock) private readonly branchStock: Repository<ErpBranchStock>
  ) {}

  async fullLoadByGroups(groups: number[]) {
    const nodeGrupo = process.env.ZETTI_NODE_GRUPO!;
    let page = 0;
    const size = Number(process.env.ZETTI_PAGE_SIZE ?? '500');
    const productIds = new Set<string>();
    while (true) {
      const res = await this.zetti.searchProductsByGroup(nodeGrupo, groups, page, size);
      for (const item of res.content) productIds.add(String(item.id));
      if (!res.content.length || (res.totalPages && page + 1 >= res.totalPages)) break;
      page += 1;
    }
    await this.loadDetails([...productIds]);
  }

  async incrementalByDates(from: string, to: string) {
    const nodeGrupo = process.env.ZETTI_NODE_GRUPO!;
    let page = 0;
    const size = Number(process.env.ZETTI_PAGE_SIZE ?? '500');
    const productIds = new Set<string>();
    while (true) {
      const res = await this.zetti.searchProductsByActualization(nodeGrupo, from, to, page, size);
      for (const item of res.content) productIds.add(String(item.id));
      if (!res.content.length || (res.totalPages && page + 1 >= res.totalPages)) break;
      page += 1;
    }
    await this.loadDetails([...productIds]);
  }

  private async loadDetails(productIds: string[]) {
    const nodeFarmacia = process.env.ZETTI_NODE_FARMACIA!;
    const batch = 200;
    for (let i = 0; i < productIds.length; i += batch) {
      const slice = productIds.slice(i, i + batch);
      const details = await this.zetti.detailsPerNodes(process.env.ZETTI_NODE_GRUPO!, [nodeFarmacia], slice);
      await this.upsertDetails(details.items);
    }
  }

  private async upsertDetails(items: Array<{ nodeId: string | number; productId: string | number; skuId?: string | number | null; price?: number | string | null; currency?: string | null; stock?: number | string | null; stockReserved?: number | string | null }>) {
    await this.products.manager.transaction(async (trx) => {
      for (const d of items) {
        const externalProductId = String(d.productId);
        let product = await trx.findOne(ErpProduct, { where: { externalId: externalProductId } });
        if (!product) {
          product = trx.create(ErpProduct, { externalId: externalProductId, isPrescription: false });
          await trx.save(product);
        }
        if (d.skuId) {
          const externalSkuId = String(d.skuId);
          let sku = await trx.findOne(ErpSku, { where: { externalId: externalSkuId } });
          if (!sku) {
            sku = trx.create(ErpSku, { externalId: externalSkuId, product });
          } else {
            sku.product = product;
          }
          await trx.save(sku);

          let bs = await trx.findOne(ErpBranchStock, { where: { sku: { id: sku.id }, branchId: String(d.nodeId) }, relations: ['sku'] });
          if (!bs) bs = trx.create(ErpBranchStock, { sku, branchId: String(d.nodeId), price: Number(d.price ?? 0), currency: d.currency ?? 'ARS', stock: Number(d.stock ?? 0), stockReserved: Number(d.stockReserved ?? 0) });
          else {
            bs.price = Number(d.price ?? 0);
            bs.currency = d.currency ?? 'ARS';
            bs.stock = Number(d.stock ?? 0);
            bs.stockReserved = Number(d.stockReserved ?? 0);
          }
          await trx.save(bs);
        }
      }
    });
  }
}


