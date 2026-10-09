import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

interface IContactsForm {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, () => events.emit('contacts:submit'));

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.events.emit('contacts:email', { email: target.value });
    });

    this.phoneInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.events.emit('contacts:phone', { phone: target.value });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}