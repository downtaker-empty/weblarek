import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { apiProducts } from './utils/data';

import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { CardGallery } from './components/views/CardGallery';
import { CardPreview } from './components/views/CardPreview';
import { Basket as BasketView } from './components/views/Basket';
import { BasketItem } from './components/views/BasketItem';
import { OrderForm, Payment } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';

import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

export class Presenter {
  protected catalog: Catalog;
  protected basket: Basket;
  protected buyer: Buyer;

  protected header: Header;
  protected gallery: Gallery;
  protected modal: Modal;
  protected basketView: BasketView;
  protected orderForm: OrderForm;
  protected contactsForm: ContactsForm;
  protected success: Success;

  constructor(
    protected events: EventEmitter,
    protected api: WebLarekApi,
  ) {
    this.catalog = new Catalog(events);
    this.basket = new Basket(events);
    this.buyer = new Buyer(events);

    this.header = new Header(document.querySelector('.header') as HTMLElement, events);
    this.gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
    this.modal = new Modal(document.querySelector('#modal-container') as HTMLElement);

    this.basketView = new BasketView(cloneTemplate('#basket'), events);
    this.orderForm = new OrderForm(cloneTemplate('#order'), events);
    this.contactsForm = new ContactsForm(cloneTemplate('#contacts'), events);
    this.success = new Success(cloneTemplate('#success'), events);

    this.subscribe();
    void this.loadProducts();
  }

  protected subscribe() {
    this.events.on('basket:open', () => this.openBasket());

    this.events.on('catalog:changed', () => this.renderGallery());
    this.events.on('product:select', (data: { id: string }) => {
      const item = this.catalog.findProductById(data.id);
      if (item) this.catalog.selectedProduct = item;
    });
    this.events.on('product:selected', () => this.openPreview());
    this.events.on('product:toggle', () => this.toggleProductInBasket());

    this.events.on('basket:changed', () => this.updateHeaderCounter());
    this.events.on('basket:remove', (data: { id: string }) => {
      this.basket.remove(data.id);
      this.renderBasket();
      this.modal.render({ content: this.basketView.render() });
    });

    this.events.on('order:open', () => this.openOrderForm());
    this.events.on('order:payment', (data: { payment: Payment }) => {
      this.buyer.info = { payment: data.payment };
    });
    this.events.on('order:address', (data: { address: string }) => {
      this.buyer.info = { address: data.address };
    });
    this.events.on('buyer:changed', () => {
      this.renderOrderForm();
      this.renderContactsForm();
    });
    this.events.on('order:next', () => this.openContactsForm());

    this.events.on('contacts:email', (data: { email: string }) => {
      this.buyer.info = { email: data.email };
    });
    this.events.on('contacts:phone', (data: { phone: string }) => {
      this.buyer.info = { phone: data.phone };
    });
    this.events.on('contacts:submit', () => void this.submitOrder());

    this.events.on('success:close', () => this.modal.close());
  }

  protected async loadProducts() {
    try {
      const data = await this.api.getProducts();
      this.catalog.products = data.items;
      console.log('Каталог загружен с сервера:', data.items.length);
    } catch (error) {
      console.warn('Не удалось получить каталог с сервера, беру локальные данные.', error);
      this.catalog.products = apiProducts.items;
    }
  }

  protected renderGallery() {
    const cards = this.catalog.products.map((item) => {
      const card = new CardGallery(cloneTemplate('#card-catalog'), {
        onClick: () => this.events.emit('product:select', { id: item.id }),
      });
      return card.render({
        title: item.title,
        price: item.price,
        category: item.category,
        image: item.image,
      });
    });
    this.gallery.items = cards;
  }

  protected openPreview() {
    const item = this.catalog.selectedProduct;
    if (!item) return;

    const inBasket = this.basket.inBasket(item.id);
    const noPrice = item.price === null;

    const preview = new CardPreview(cloneTemplate('#card-preview'), {
      onClick: () => this.events.emit('product:toggle'),
    });

    preview.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: item.image,
      description: item.description,
      buttonText: noPrice ? 'Недоступно' : inBasket ? 'Удалить из корзины' : 'Купить',
      buttonDisabled: noPrice,
    });

    this.modal.render({ content: preview.render() });
  }

  protected toggleProductInBasket() {
    const item = this.catalog.selectedProduct;
    if (!item || item.price === null) return;

    if (this.basket.inBasket(item.id)) {
      this.basket.remove(item.id);
    } else {
      this.basket.add(item);
    }
    this.modal.close();
  }

  protected openBasket() {
    this.renderBasket();
    this.modal.render({ content: this.basketView.render() });
  }

  protected renderBasket() {
    const items = this.basket.selectedProducts;
    const itemViews = items.map((item, index) => {
      const row = new BasketItem(cloneTemplate('#card-basket'), {
        onDelete: () => this.events.emit('basket:remove', { id: item.id }),
      });
      return row.render({
        index: index + 1,
        title: item.title,
        price: item.price ?? 0,
      });
    });

    this.basketView.items = itemViews;
    this.basketView.total = this.basket.totalCost;
    this.basketView.disabled = items.length === 0;
  }

  protected openOrderForm() {
    this.renderOrderForm();
    this.modal.render({ content: this.orderForm.render() });
  }

  protected renderOrderForm() {
    const { payment, address } = this.buyer.info;
    const errors = this.buyer.validate();
    const valid = !errors.payment && !errors.address;

    this.orderForm.payment = payment;
    this.orderForm.address = address;
    this.orderForm.valid = valid;
    this.orderForm.errors = [errors.payment, errors.address]
      .filter(Boolean)
      .join('; ');
  }

  protected openContactsForm() {
    this.renderContactsForm();
    this.modal.render({ content: this.contactsForm.render() });
  }

  protected renderContactsForm() {
    const { email, phone } = this.buyer.info;
    const errors = this.buyer.validate();
    const valid = !errors.email && !errors.phone;

    this.contactsForm.email = email;
    this.contactsForm.phone = phone;
    this.contactsForm.valid = valid;
    this.contactsForm.errors = [errors.email, errors.phone]
      .filter(Boolean)
      .join('; ');
  }

  protected async submitOrder() {
    const buyer = this.buyer.info;
    const items = this.basket.selectedProducts.map((i) => i.id);
    const total = this.basket.totalCost;

    if (buyer.payment === null) return;

    try {
      await this.api.postOrder({
        payment: buyer.payment,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        items,
        total,
      });
      console.log('Заказ успешно отправлен на сервер.');
    } catch (error) {
      console.warn('Не удалось отправить заказ на сервер, работаем в локальном режиме.', error);
      console.log('Order payload:', {
        payment: buyer.payment,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        items,
        total,
      });
    }

    this.basket.clear();
    this.buyer.clear();
    this.success.total = total;
    this.modal.render({ content: this.success.render() });
  }

  protected updateHeaderCounter() {
    this.header.counter = this.basket.totalCount;
  }
}

/////////////////////////////////////////
// Точка входа
/////////////////////////////////////////

const events = new EventEmitter();
const api = new Api(API_URL);
console.log(API_URL);
const webLarekApi = new WebLarekApi(api);

new Presenter(events, webLarekApi);