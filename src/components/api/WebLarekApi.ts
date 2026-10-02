import { Api } from '../base/Api';
import { IProductResponse, IOrder, IOrderResponse } from '../../types';

export class WebLarekApi {
  constructor(private api: Api) {}

  getProducts(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>('/product/');
  }

  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}