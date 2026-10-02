import './scss/styles.scss';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// ------------------------------------------------------------------
// 1. Создание экземпляров
// ------------------------------------------------------------------

const api = new Api(API_URL);
console.log(API_URL);
const webLarekApi = new WebLarekApi(api);
const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer();

// ------------------------------------------------------------------
// 2. Проверки моделей на данных 
// ------------------------------------------------------------------

// --- Catalog ---
catalog.products = apiProducts.items;
console.log('Catalog: массив товаров', catalog.products);

const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];

catalog.selectedProduct = firstProduct;
console.log('Catalog: выбранный товар', catalog.selectedProduct);

console.log(
  `Catalog: поиск по id "${firstProduct.id}"`,
  catalog.findProductById(firstProduct.id)
);

// --- Basket ---
basket.add(firstProduct);
basket.add(firstProduct);
basket.add(secondProduct);

console.log('Basket: товары в корзине', basket.selectedProducts);
console.log('Basket: общее количество', basket.totalCount);
console.log('Basket: общая стоимость', basket.totalCost);
console.log(`Basket: товар "${firstProduct.id}" в корзине?`, basket.inBasket(firstProduct.id));

basket.remove(secondProduct.id);
console.log('Basket: после удаления второго товара', basket.selectedProducts);

// --- Buyer ---
buyer.info = {
  email: 'buyer@example.com',
  phone: '+7 000 000-00-00',
  address: 'Москва, ул. Пушкина, д. 1',
  payment: 'card',
};
console.log('Buyer: данные покупателя', buyer.info);

console.log('Buyer: валидация корректных данных', buyer.validate());

buyer.info = { email: '' };
console.log('Buyer: валидация с пустым email', buyer.validate());

// --- Очистка ---
basket.clear();
console.log('Basket: после clear', basket.selectedProducts);

buyer.clear();
console.log('Buyer: после clear', buyer.info);

catalog.clearSelectedProduct();
console.log('Catalog: выбранный товар сброшен', catalog.selectedProduct);

// ------------------------------------------------------------------
// 3. Запрос к серверу за каталогом
// 4. Сохранение массива в модель и вывод в консоль
// ------------------------------------------------------------------

webLarekApi
  .getProducts()
  .then((apiProducts) => {
    catalog.products = apiProducts.items;

    console.log('apiProducts:', apiProducts);
    console.log('Массив товаров из каталога:', catalog.products);
  })
  .catch((error) => {
    console.error('Ошибка при загрузке каталога:', error);
  });