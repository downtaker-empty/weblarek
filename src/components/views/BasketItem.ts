import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

interface IBasketItem {
  index: number;
}

interface IBasketItemActions {
  onDelete: () => void;
}

export class BasketItem extends Card<IBasketItem> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketItemActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onDelete) {
      this.deleteButton.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = `${value}`;
  }
}