import { EventEmitter } from './components/base/events';
import { ShopAPI } from './components/ShopAPI';
import { AppData } from './components/common/AppData';
import { Page } from './components/common/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Gallery } from './components/common/Gallery';
import { OrderForm } from './components/common/OrderForm';
import { ContactsForm } from './components/common/ContactsForm';
import { Success } from './components/common/Success';
import { Card } from './components/common/Card';
import { IProduct, IOrderResult, FormErrors } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import './scss/styles.scss';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

const appData = new AppData(events);
const page = new Page(document.body, events);
const modal = new Modal(events);
const basket = new Basket(events);
const gallery = new Gallery(events);
const orderForm = new OrderForm(events);
const contactsForm = new ContactsForm(events);
const success = new Success(events);


api.getProducts()
    .then((products: IProduct[]) => {
        appData.setCatalog(products);
    })
    .catch(err => {
        console.error('Ошибка загрузки товаров:', err);
        const mockProducts: IProduct[] = [
            {
                id: '1',
                title: 'Фреймворк куки судьбы',
                price: 2500,
                description: 'Мощный фреймворк для предсказания будущего',
                image: `${CDN_URL}/images/framework.jpg`,
                category: 'софт-скил'
            },
            {
                id: '2', 
                title: '+1 час в сутках',
                price: 750,
                description: 'Дополнительный час для coding marathon',
                image: `${CDN_URL}/images/time.jpg`,
                category: 'другое'
            },
            {
                id: '3',
                title: 'Бесплатный товар',
                price: null,
                description: 'Тестовый бесплатный товар',
                image: `${CDN_URL}/images/free.jpg`,
                category: 'другое'
            }
        ];
        appData.setCatalog(mockProducts);
    });

events.on('catalog:changed', () => {
    gallery.update(appData.catalog);
});

events.on('basket:changed', () => {
    page.counter = appData.basket.length;
    const items = appData.basket.map((id, index) => {
        const item = appData.catalog.find(it => it.id === id);
        if (!item) return null;
        
        const cardElement = cloneTemplate<HTMLElement>('#card-basket');
        const card = new Card('card', cardElement, {
            onClick: () => {
                appData.removeFromBasket(id);
                events.emit('basket:changed');
            }
        });
        
        const basketItem = card.render({
            title: item.title,
            price: item.price
        });
        
        const indexElement = basketItem.querySelector('.basket__item-index');
        if (indexElement) {
            indexElement.textContent = String(index + 1);
        }
        
        return basketItem;
    }).filter(Boolean) as HTMLElement[];
    
    basket.items = items;
    basket.total = appData.getTotal();
    basket.selected = appData.basket.length > 0 && appData.getTotal() > 0;
});

events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-preview');
    const card = new Card('card', cardElement, {
        onClick: () => {
            if (appData.isInBasket(item)) {
                appData.removeFromBasket(item.id);
            } else if (item.price !== null) {
                appData.addToBasket(item);
            }
            modal.close();
        }
    });
    
    const cardRendered = card.render({
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price,
        description: item.description,
        selected: appData.isInBasket(item)
    });
    
    modal.content = cardRendered;
    modal.open();
});

events.on('basket:open', () => {
    events.emit('basket:changed');
    modal.content = basket.render();
    modal.open();
});

events.on('order:ready', () => {
    modal.content = orderForm.render({
        payment: appData.order.payment,
        address: appData.order.address,
        valid: appData.validateOrder(),
        errors: {}
    });
    modal.open();
});

events.on('order.payment:change', (data: { field: string, value: string }) => {
    appData.setOrderField('payment', data.value);
});

events.on('order.address:change', (data: { field: string, value: string }) => {
    appData.setOrderField('address', data.value);
});

events.on('orderErrors:change', (errors: FormErrors) => {
    orderForm.valid = Object.keys(errors).length === 0;
    orderForm.errors = errors;
});

events.on('order:submit', () => {
    if (appData.validateOrder()) {
        modal.content = contactsForm.render({
            email: appData.order.email,
            phone: appData.order.phone,
            valid: appData.validateContacts(),
            errors: {}
        });
    }
});

events.on('contacts.email:change', (data: { field: string, value: string }) => {
    appData.setOrderField('email', data.value);
});

events.on('contacts.phone:change', (data: { field: string, value: string }) => {
    appData.setOrderField('phone', data.value);
});

events.on('contactsErrors:change', (errors: FormErrors) => {
    contactsForm.valid = Object.keys(errors).length === 0;
    contactsForm.errors = errors;
});

events.on('contacts:submit', () => {
    if (appData.validateContacts()) {
        appData.order.items = appData.basket;
        appData.order.total = appData.getTotal();
        
        api.orderProducts(appData.order)
            .then((result: IOrderResult) => {
                modal.content = success.render({
                    total: result.total
                });
                appData.clearBasket();
            })
            .catch(err => {
                console.error('Ошибка оформления заказа:', err);
            });
    }
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});