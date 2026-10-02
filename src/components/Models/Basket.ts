import { IProduct } from "../../types";

export class Basket {
// Так сложилось во всех моделях: private закрывает поле снаружи,
// а _ помогает глазу отличать поле от одноимённого get/set.
// Мне так читается проще — поэтому решил оставил единообразно.

  private _selectedProducts: IProduct[] = [];

  get selectedProducts(): IProduct[] {
    return this._selectedProducts;
  }

  add(product: IProduct): void {
    const exists = this._selectedProducts.some(p => p.id === product.id);
    if (!exists) {
      this._selectedProducts.push(product);
    }
  }

  remove(id: string): void {
    this._selectedProducts = this._selectedProducts.filter(p => p.id !== id);
  }

  clear(): void {
    this._selectedProducts = [];
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