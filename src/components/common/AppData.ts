import { EventEmitter } from '../base/events';
import { IProduct, IOrder, FormErrors } from '../../types';

export class AppData {
    catalog: IProduct[] = [];
    basket: string[] = [];
    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0
    };
    preview: string | null = null;
    loading: boolean = false;

    constructor(protected events: EventEmitter) {}

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.events.emit('catalog:changed');
    }

    addToBasket(item: IProduct) {
        if (!this.basket.includes(item.id)) {
            this.basket.push(item.id);
            this.events.emit('basket:changed');
        }
    }

    removeFromBasket(id: string) {
        this.basket = this.basket.filter(item => item !== id);
        this.events.emit('basket:changed');
    }

    getTotal(): number {
        return this.basket.reduce((sum, id) => {
            const item = this.catalog.find(it => it.id === id);
            return sum + (item?.price || 0);
        }, 0);
    }

    clearBasket() {
        this.basket = [];
        this.events.emit('basket:changed');
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.events.emit('preview:changed', item);
    }

    setOrderField(field: keyof IOrder, value: string) {
        this.order[field] = value as never;
        
        if (field === 'payment' || field === 'address') {
            this.validateOrder();
        } else if (field === 'email' || field === 'phone') {
            this.validateContacts();
        }
    }

    validateOrder(): boolean {
        const errors: FormErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        
        const total = this.getTotal();
        if (total <= 0) {
            errors.total = 'Недостаточно средств для оформления заказа';
        }
        
        this.events.emit('orderErrors:change', errors);
        return Object.keys(errors).length === 0;
    }

    validateContacts(): boolean {
        const errors: FormErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.events.emit('contactsErrors:change', errors);
        return Object.keys(errors).length === 0;
    }

    isInBasket(item: IProduct): boolean {
        return this.basket.includes(item.id);
    }

    getBasketItems(): IProduct[] {
        return this.basket.map(id => this.catalog.find(item => item.id === id)).filter(Boolean) as IProduct[];
    }
}