import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IContactsForm {
  email: string;
  phone: string;
  valid: boolean;
  errors: string;
}

export class ContactsForm extends Component<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.emailInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.events.emit('contacts:email', { email: target.value });
    });

    this.phoneInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.events.emit('contacts:phone', { phone: target.value });
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('contacts:submit');
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorElement.textContent = value;
  }
}