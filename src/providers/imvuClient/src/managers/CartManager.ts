import { BaseManager, Product } from '@imvu/client';
import { URLPaginator } from '../util/Paginator';

export class CartManager extends BaseManager {
	public get base(): string {
		return `/cart/cart-${this.client.account.id}`;
	}

	public async *products(): AsyncIterableIterator<Product> {
		this.authenticated();

		yield* new URLPaginator(this.client, Product, `${this.base}/products`);
	}

	public async price(): Promise<number> {
		const { data } = await this.client.resource(this.base);

		return data['total_price'];
	}
}
