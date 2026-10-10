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

/////////////////////////////////////////
// Инфраструктура
/////////////////////////////////////////

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

/////////////////////////////////////////
// Модели
/////////////////////////////////////////

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

/////////////////////////////////////////
// Компоненты представления
/////////////////////////////////////////

const header = new Header(document.querySelector('.header') as HTMLElement, events);
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement);

const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new OrderForm(cloneTemplate('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts'), events);
const success = new Success(cloneTemplate('#success'), events);
const preview = new CardPreview(cloneTemplate('#card-preview'), {
  onClick: () => events.emit('product:toggle'),
});

/////////////////////////////////////////
// Функции-обработчики
/////////////////////////////////////////

async function loadProducts(): Promise<void> {
  try {
    const data = await webLarekApi.getProducts();
    catalog.products = data.items;
    console.log('Каталог загружен с сервера:', data.items.length);
  } catch (error) {
    console.warn('Не удалось получить каталог с сервера, беру локальные данные.', error);
    catalog.products = apiProducts.items;
  }
}

function renderGallery(): void {
  const cards = catalog.products.map((item) => {
    const card = new CardGallery(cloneTemplate('#card-catalog'), {
      onClick: () => events.emit('product:select', { id: item.id }),
    });
    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: item.image,
    });
  });
  gallery.items = cards;
}

function openPreview(): void {
  const item = catalog.selectedProduct;
  if (!item) return;

  const inBasket = basket.inBasket(item.id);
  const noPrice = item.price === null;

  preview.render({
    title: item.title,
    price: item.price,
    category: item.category,
    image: item.image,
    description: item.description,
    buttonText: noPrice ? 'Недоступно' : inBasket ? 'Удалить из корзины' : 'Купить',
    buttonDisabled: noPrice,
  });

  modal.render({ content: preview.render() });
}

function toggleProductInBasket(): void {
  const item = catalog.selectedProduct;
  if (!item || item.price === null) return;

  if (basket.inBasket(item.id)) {
    basket.remove(item.id);
  } else {
    basket.add(item);
  }
  modal.close();
}

function openBasket(): void {
  renderBasket();
  modal.render({ content: basketView.render() });
}

function renderBasket(): void {
  const items = basket.selectedProducts;
  const itemViews = items.map((item, index) => {
    const row = new BasketItem(cloneTemplate('#card-basket'), {
      onDelete: () => events.emit('basket:remove', { id: item.id }),
    });
    return row.render({
      index: index + 1,
      title: item.title,
      price: item.price ?? 0,
    });
  });

  basketView.items = itemViews;
  basketView.total = basket.totalCost;
  basketView.disabled = items.length === 0;
  header.counter = basket.totalCount;
}

function openOrderForm(): void {
  renderOrderForm();
  modal.render({ content: orderForm.render() });
}

function renderOrderForm(): void {
  const { payment, address } = buyer.info;
  const errors = buyer.validate();
  const valid = !errors.payment && !errors.address;

  orderForm.payment = payment;
  orderForm.address = address;
  orderForm.valid = valid;
  orderForm.errors = [errors.payment, errors.address]
    .filter(Boolean)
    .join('; ');
}

function openContactsForm(): void {
  renderContactsForm();
  modal.render({ content: contactsForm.render() });
}

function renderContactsForm(): void {
  const { email, phone } = buyer.info;
  const errors = buyer.validate();
  const valid = !errors.email && !errors.phone;

  contactsForm.email = email;
  contactsForm.phone = phone;
  contactsForm.valid = valid;
  contactsForm.errors = [errors.email, errors.phone]
    .filter(Boolean)
    .join('; ');
}

async function submitOrder(): Promise<void> {
  const buyerInfo = buyer.info;
  const items = basket.selectedProducts.map((i) => i.id);
  const total = basket.totalCost;

  if (buyerInfo.payment === null) return;

  try {
    await webLarekApi.postOrder({
      payment: buyerInfo.payment,
      email: buyerInfo.email,
      phone: buyerInfo.phone,
      address: buyerInfo.address,
      items,
      total,
    });
    console.log('Заказ успешно отправлен на сервер.');
  } catch (error) {
    console.warn('Не удалось отправить заказ на сервер, работаем в локальном режиме.', error);
    console.log('Order payload:', {
      payment: buyerInfo.payment,
      email: buyerInfo.email,
      phone: buyerInfo.phone,
      address: buyerInfo.address,
      items,
      total,
    });
  }

  basket.clear();
  buyer.clear();
  success.total = total;
  modal.render({ content: success.render() });
}

/*function updateHeaderCounter(): void {
  header.counter = basket.totalCount;
}*/

/////////////////////////////////////////
// Подписки на события
/////////////////////////////////////////

events.on('basket:open', openBasket);

events.on('catalog:changed', renderGallery);
events.on('product:select', (data: { id: string }) => {
  const item = catalog.findProductById(data.id);
  if (item) catalog.selectedProduct = item;
});
events.on('product:selected', openPreview);
events.on('product:toggle', toggleProductInBasket);

events.on('basket:changed', renderBasket);
events.on('basket:remove', (data: { id: string }) => {
  basket.remove(data.id);
  renderBasket();
  modal.render({ content: basketView.render() });
});

events.on('order:open', openOrderForm);
events.on('order:payment', (data: { payment: Payment }) => {
  buyer.info = { payment: data.payment };
});
events.on('order:address', (data: { address: string }) => {
  buyer.info = { address: data.address };
});
events.on('buyer:changed', () => {
  renderOrderForm();
  renderContactsForm();
});
events.on('order:next', openContactsForm);

events.on('contacts:email', (data: { email: string }) => {
  buyer.info = { email: data.email };
});
events.on('contacts:phone', (data: { phone: string }) => {
  buyer.info = { phone: data.phone };
});
events.on('contacts:submit', () => void submitOrder());

events.on('success:close', () => modal.close());

/////////////////////////////////////////
// Запуск приложения
/////////////////////////////////////////

console.log(API_URL);
void loadProducts();