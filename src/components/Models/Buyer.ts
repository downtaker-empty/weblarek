import { IBuyer, BuyerErrors } from "../../types";

export class Buyer {
  private _buyerInfo: IBuyer = {
    address: '',
    email: '',
    phone: '',
    payment: null,
  };

  get info(): IBuyer {
    return this._buyerInfo;
  }

  set info(val: Partial<IBuyer>) {
  this._buyerInfo = { ...this._buyerInfo, ...val };
  }

  clear(): void {
    this._buyerInfo = {
      address: '',
      email: '',
      phone: '',
      payment: null,
    };
  }

  validate(): BuyerErrors {
    const errors: BuyerErrors = {};

    if (!this._buyerInfo.email || this._buyerInfo.email.trim() === '') {
      errors.email = 'Email обязателен';
    }

    if (!this._buyerInfo.address || this._buyerInfo.address.trim() === '') {
      errors.address = 'Адрес обязателен';
    }

    if (!this._buyerInfo.phone || this._buyerInfo.phone.trim() === '') {
      errors.phone = 'Не указали телефон';
    }

    if (!this._buyerInfo.payment) {
      errors.payment = 'Способ оплаты обязателен';
    }

    return errors;
  }
}