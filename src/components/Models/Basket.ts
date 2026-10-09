import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  private _selectedProducts: IProduct[] = [];

  constructor(private events:IEvents){}

  get selectedProducts(): IProduct[] {
    return this._selectedProducts;
  }

  add(product: IProduct): void {
    if (!this.inBasket(product.id)) {
      this._selectedProducts.push(product);
      this.events.emit('basket:changed');
    }
  }

  remove(id: string): void {
    this._selectedProducts = this._selectedProducts.filter(p => p.id !== id);
    this.events.emit('basket:changed');
  }

  clear(): void {
    this._selectedProducts = [];
    this.events.emit('basket:changed');
  }

  get totalCost(): number {
    return this._selectedProducts.reduce((sum, product) => sum + (product.price ?? 0), 0);
  }

  get totalCount(): number {
    return this._selectedProducts.length;
  }

  inBasket(id: string): boolean {
    return this._selectedProducts.some(p => p.id === id);
  }
}