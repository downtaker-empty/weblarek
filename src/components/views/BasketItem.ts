import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IBasketItem {
  index: number;
  title: string;
  price: number;
}

interface IBasketItemActions {
  onDelete: () => void;
}

export class BasketItem extends Component<IBasketItem> {
  protected indexElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketItemActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onDelete) {
      this.deleteButton.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = `${value}`;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }
}