import { SyncService } from './sync.service';
import { ZettiClient } from './zetti.client';

describe('SyncService (unit)', () => {
  function makeRepoMocks() {
    const products = new Map<string, any>();
    const skus = new Map<string, any>();
    const branchStock: Array<any> = [];

    const trx = {
      findOne: async (entity: any, opts: any) => {
        if (entity.name === 'ErpProduct' || entity.prototype?.externalId !== undefined) {
          const key = opts.where.externalId;
          return products.get(key) || null;
        }
        if (entity.name === 'ErpSku' || entity.prototype?.barcode !== undefined) {
          const key = opts.where.externalId;
          return skus.get(key) || null;
        }
        if (entity.name === 'ErpBranchStock' || Array.isArray(branchStock)) {
          const { branchId } = opts.where;
          const skuId = opts.where.sku.id;
          return branchStock.find((b) => b.branchId === branchId && b.sku?.id === skuId) || null;
        }
        return null;
      },
      create: (entity: any, data: any) => ({ ...data, id: data.id ?? `${entity.name}-${Math.random().toString(36).slice(2)}` }),
      save: async (entity: any) => entity
    };

    const productsRepo: any = {
      manager: { transaction: async (cb: any) => cb(trx) }
    };
    const skusRepo: any = {};
    const branchStockRepo: any = {};

    // intercept saves in transaction via monkey patching trx.save
    trx.save = async (e: any) => {
      if ('externalId' in e && 'isPrescription' in e) {
        if (!e.id) e.id = `p-${e.externalId}`;
        products.set(e.externalId, e);
      } else if ('externalId' in e && ('code' in e || 'barcode' in e)) {
        if (!e.id) e.id = `s-${e.externalId}`;
        skus.set(e.externalId, e);
      } else if ('branchId' in e && 'price' in e) {
        if (!e.id) e.id = `bs-${branchStock.length + 1}`;
        // upsert behavior
        const idx = branchStock.findIndex((b) => b.branchId === e.branchId && b.sku?.id === e.sku?.id);
        if (idx >= 0) branchStock[idx] = e;
        else branchStock.push(e);
      }
      return e;
    };

    return { productsRepo, skusRepo, branchStockRepo, products, skus, branchStock };
  }

  it('upsertDetails is idempotent by externalId (product and sku)', async () => {
    const { productsRepo, skusRepo, branchStockRepo, products, skus, branchStock } = makeRepoMocks();
    const zetti = {} as unknown as ZettiClient;
    const svc = new SyncService(zetti, productsRepo, skusRepo, branchStockRepo);
    const items = [
      { nodeId: 'N1', productId: 'P1', skuId: 'S1', price: 100, currency: 'ARS', stock: 10, stockReserved: 2 }
    ];
    // call private via any
    await (svc as any).upsertDetails(items);
    await (svc as any).upsertDetails(items);
    expect(products.size).toBe(1);
    expect(skus.size).toBe(1);
    expect(branchStock.length).toBe(1);
    expect(branchStock[0].stock).toBe(10);
    expect(branchStock[0].stockReserved).toBe(2);
  });

  it('fullLoadByGroups collects ids and loads details', async () => {
    const { productsRepo, skusRepo, branchStockRepo, branchStock } = makeRepoMocks();
    const zetti = {
      searchProductsByGroup: async () => ({ content: [{ id: '11' }], page: 0, size: 1, totalPages: 1, totalElements: 1 }),
      detailsPerNodes: async () => ({ items: [{ nodeId: 'N1', productId: '11', skuId: 'S1', price: 50, currency: 'ARS', stock: 5, stockReserved: 1 }] })
    } as unknown as ZettiClient;
    process.env.ZETTI_NODE_GRUPO = 'G1';
    process.env.ZETTI_NODE_FARMACIA = 'N1';
    const svc = new SyncService(zetti, productsRepo, skusRepo, branchStockRepo);
    await svc.fullLoadByGroups([2]);
    expect(branchStock.length).toBe(1);
    expect(branchStock[0].price).toBe(50);
  });
});


