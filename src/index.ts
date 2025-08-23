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
import { API_URL, CDN_URL, AppEvents } from './utils/constants';
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
        gallery.update([]);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Не удалось загрузить товары. Пожалуйста, попробуйте позже.';
        document.querySelector('.gallery')?.appendChild(errorMessage);
    });

events.on(AppEvents.CATALOG_CHANGED, () => {
    gallery.update(appData.catalog);
});

events.on(AppEvents.BASKET_CHANGED, () => {
    page.counter = appData.basket.length;
    const items = appData.basket.map((id, index) => {
        const item = appData.catalog.find(it => it.id === id);
        if (!item) return null;
        
        const cardElement = cloneTemplate<HTMLElement>('#card-basket');
        const card = new Card('card', cardElement, {
            onClick: () => {
                appData.removeFromBasket(id);
                events.emit(AppEvents.BASKET_CHANGED);
            }
        });
        
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1 
        });
    }).filter(Boolean) as HTMLElement[];
    
    basket.items = items;
    basket.total = appData.getTotal();
    basket.selected = appData.basket.length > 0 && appData.getTotal() > 0;
});

events.on(AppEvents.CARD_SELECT, (item: IProduct) => {
    appData.setPreview(item);
});

events.on(AppEvents.PREVIEW_CHANGED, (item: IProduct) => {
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

events.on(AppEvents.BASKET_OPEN, () => {
    events.emit(AppEvents.BASKET_CHANGED);
    modal.content = basket.render();
    modal.open();
});

events.on(AppEvents.ORDER_READY, () => {
    modal.content = orderForm.render({
        payment: appData.order.payment,
        address: appData.order.address,
        valid: appData.validateOrder(),
        errors: '' 
    });
    modal.open();
});

events.on(AppEvents.ORDER_PAYMENT_CHANGE, (data: { field: string, value: string }) => {
    appData.setOrderField('payment', data.value);
});

events.on(AppEvents.ORDER_ADDRESS_CHANGE, (data: { field: string, value: string }) => {
    appData.setOrderField('address', data.value);
});

events.on(AppEvents.ORDER_ERRORS_CHANGE, (errors: FormErrors) => {
    orderForm.valid = Object.keys(errors).length === 0;
    orderForm.setFormErrors(errors);
});

events.on(AppEvents.ORDER_SUBMIT, () => {
    if (appData.validateOrder()) {
        modal.content = contactsForm.render({
            email: appData.order.email,
            phone: appData.order.phone,
            valid: appData.validateContacts(),
            errors: '' 
        });
    }
});

events.on(AppEvents.CONTACTS_EMAIL_CHANGE, (data: { field: string, value: string }) => {
    appData.setOrderField('email', data.value);
});

events.on(AppEvents.CONTACTS_PHONE_CHANGE, (data: { field: string, value: string }) => {
    appData.setOrderField('phone', data.value);
});

events.on(AppEvents.CONTACTS_ERRORS_CHANGE, (errors: FormErrors) => {
    contactsForm.valid = Object.keys(errors).length === 0;
    contactsForm.setFormErrors(errors);
});

events.on(AppEvents.CONTACTS_SUBMIT, () => {
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

events.on(AppEvents.SUCCESS_CLOSE, () => {
    modal.close();
});

events.on(AppEvents.MODAL_OPEN, () => {
    page.locked = true;
});

events.on(AppEvents.MODAL_CLOSE, () => {
    page.locked = false;
});