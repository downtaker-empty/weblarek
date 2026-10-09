import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export type Payment = 'card' | 'cash' | null;

export interface IOrderForm {
  payment: Payment;
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, () => events.emit('order:next'));

    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.cardButton.addEventListener('click', () =>
      this.events.emit('order:payment', { payment: 'card' }),
    );
    this.cashButton.addEventListener('click', () =>
      this.events.emit('order:payment', { payment: 'cash' }),
    );
    this.addressInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.events.emit('order:address', { address: target.value });
    });
  }

  set payment(value: Payment) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}