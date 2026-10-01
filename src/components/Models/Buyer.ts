import { IBuyer } from "../../types";

export class Buyer {
  private _buyerInfo: IBuyer | undefined;

  set info(val: IBuyer) {
    const errors = Buyer.validate(val);
    
    if (Object.keys(errors).length > 0) {
      throw new Error('Неверные данные пользователя');
    }
    
    this._buyerInfo = val;
  }

  get info(): IBuyer | undefined {
    return this._buyerInfo;
  }

  clear(): void {
    this._buyerInfo = undefined;
  }

  static validate(data: IBuyer): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.email || String(data.email).trim() === "") {
      errors.email = 'Email обязателен';
    } else if (!data.email.includes('@')) {
      errors.email = 'Некорректный email';
    }

    if (!data.address || String(data.address).trim() === "") {
      errors.address = 'Адрес обязателен';
    }

    if (!data.phone || String(data.phone).trim() === "") {
      errors.phone = 'Не указали телефон';
    }

    return errors;
  }
}