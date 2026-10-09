import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

interface IGalleryCardActions {
  onClick: () => void;
}

interface ICardGallery {
  image: string;
  category: string;
}

export class CardGallery extends Card<ICardGallery> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: IGalleryCardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent ?? '');
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
  }
}