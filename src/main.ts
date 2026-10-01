import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './api/WebLarekApi';
import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { IBuyer, IProduct } from './types';

// ------------------------------------------------------------------
// 1. Создание экземпляров всех классов
// ------------------------------------------------------------------

const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');

const webLarekApi = new WebLarekApi(api);
const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer();

// ------------------------------------------------------------------
// 2. Тестирование моделей на локальных данных
// ------------------------------------------------------------------

const testProduct1: IProduct = {
  id: 'prod-1',
  title: 'Тестовый товар 1',
  description: 'Описание первого товара',
  image: '/images/1.jpg',
  category: 'софт-скил',
  price: 1000,
};

const testProduct2: IProduct = {
  id: 'prod-2',
  title: 'Тестовый товар 2',
  description: 'Описание второго товара',
  image: '/images/2.jpg',
  category: 'хард-скил',
  price: 2500,
};

// --- Catalog ---
catalog.products = [testProduct1, testProduct2];
console.log('Catalog.products:', catalog.products);

catalog.selectedProduct = testProduct1;
console.log('Catalog.selectedProduct:', catalog.selectedProduct);

console.log('Catalog.findProductById("prod-1"):', catalog.findProductById('prod-1'));

// --- Basket ---
basket.add(testProduct1);
basket.add(testProduct1);
basket.add(testProduct2);

console.log('Basket.selectedProducts:', basket.selectedProducts);
console.log('Basket.totalCount:', basket.totalCount);
console.log('Basket.totalCost:', basket.totalCost);
console.log('Basket.inBasket("prod-1"):', basket.inBasket('prod-1'));

basket.remove('prod-2');
console.log('Basket после remove("prod-2"):', basket.selectedProducts);

// --- Buyer ---
const testBuyer: IBuyer = {
  payment: {
    id: 'pay-1',
    orderId: 'order-1',
    amount: 3500,
    status: 'paid',
    method: 'card',
    paidAt: new Date(),
  },
  email: 'buyer@example.com',
  phone: '+7 000 000-00-00',
  address: 'Москва, ул. Пушкина, д. 1',
};

buyer.info = testBuyer;
console.log('Buyer.info:', buyer.info);

console.log('Buyer.validate(correct):', Buyer.validate(testBuyer));
console.log('Buyer.validate(bad email):', Buyer.validate({ ...testBuyer, email: 'no-at-sign' }));

// --- очистка ---
basket.clear();
console.log('Basket после clear:', basket.selectedProducts);

buyer.clear();
console.log('Buyer.info после clear:', buyer.info);

catalog.selectedProduct = undefined;
console.log('Catalog.selectedProduct сброшен:', catalog.selectedProduct);

// ------------------------------------------------------------------
// 3. Запрос к серверу за каталогом
// 4. Сохранение массива в модель и вывод в консоль
// ------------------------------------------------------------------

webLarekApi
  .getProducts()
  .then((apiProducts) => {
    catalog.products = apiProducts.items;

    console.log('apiProducts:', apiProducts);
    console.log('Catalog.products (с сервера):', catalog.products);
  })
  .catch((error) => {
    console.error('Ошибка при загрузке каталога:', error);
  });