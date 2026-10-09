import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export type Payment = 'card' | 'cash' | null;

interface IOrderForm {
  payment: Payment;
  address: string;
  valid: boolean;
  errors: string;
}

export class OrderForm extends Component<IOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);

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

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:next');
    });
  }

  set payment(value: Payment) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorElement.textContent = value;
  }
}