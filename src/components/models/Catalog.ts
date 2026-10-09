import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {

  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | undefined = undefined;

  constructor(private events:IEvents){}

  set products(val: IProduct[]) {
    this._products = val;
    this.events.emit('catalog:changed');
  }

  get products(): IProduct[] {
    return this._products;
  }

  findProductById(id: string): IProduct | undefined {
    return this._products.find(product => product.id === id);
  }

  set selectedProduct(val: IProduct) {
    this._selectedProduct = val;
    this.events.emit('product:selected');
  }

  get selectedProduct(): IProduct | undefined {
    return this._selectedProduct;
  }

}