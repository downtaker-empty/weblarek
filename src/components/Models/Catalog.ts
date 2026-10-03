import { IProduct } from "../../types";

export class Catalog {

  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | undefined = undefined;

  set products(val: IProduct[]) {
    this._products = val;
  }

  get products(): IProduct[] {
    return this._products;
  }

  findProductById(id: string): IProduct | undefined {
    return this._products.find(product => product.id === id);
  }

  set selectedProduct(val: IProduct) {
    this._selectedProduct = val;
  }

  get selectedProduct(): IProduct | undefined {
    return this._selectedProduct;
  }

}