import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: boolean;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        super(cloneTemplate<HTMLTemplateElement>('#basket'));
        this.events = events;
        
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('order:ready');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this.setText(this._list, '');
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'basket__empty';
            emptyMessage.textContent = 'Корзина пуста';
            this._list.appendChild(emptyMessage);
        } else {
            this._list.replaceChildren(...items);
        }
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set selected(value: boolean) {
        this.setDisabled(this._button, !value);
    }
}