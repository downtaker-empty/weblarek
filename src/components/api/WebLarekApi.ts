import { IProductResponse, IOrder, IOrderResponse, IApi } from '../../types';

export class WebLarekApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>('/product/');
  }

  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}