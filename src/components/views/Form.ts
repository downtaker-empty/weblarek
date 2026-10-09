import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormState {
  valid: boolean;
  errors: string;
}

export abstract class Form<T = object> extends Component<IFormState & T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  protected constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected onSubmit: () => void,
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorElement.textContent = value;
  }
}