import { CartItem, IProduct } from "../../types";

export class Basket {
  private _selectedProducts: CartItem[] = [];

  get selectedProducts(): CartItem[] {
    return this._selectedProducts;
  }

  add(product: IProduct): void {
    const item = this._selectedProducts.find(i => i.product.id === product.id);

    if (item) {
      item.quantity += 1;
    } else {
      this._selectedProducts.push({ product, quantity: 1 });
    }
  }

  remove(id: string): void {
    this._selectedProducts = this._selectedProducts.filter(i => i.product.id !== id);
  }

  clear(): void {
    this._selectedProducts = [];
  }

  get totalCost(): number {
    return this._selectedProducts.reduce(
      (sum, item) => sum + ((item.product.price ?? 0) * item.quantity), 
      0
    );
  }

  get totalCount(): number {
    return this._selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
  }

  inBasket(id: string): boolean {
    return this._selectedProducts.some(i => i.product.id === id);
  }
}