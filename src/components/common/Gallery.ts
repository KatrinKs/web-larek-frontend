import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { Card } from './Card';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';

interface IGallery {
    items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected container: HTMLElement;
    protected _cards: HTMLElement[] = [];
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        const container = ensureElement<HTMLElement>('.gallery');
        super(container);
        this.container = container;
        this.events = events;
    }

    update(items: IProduct[]) {
        console.log('Обновление галереи:', items);
        
        if (items.length === 0) {
            this.setText(this.container, '');
            const notFound = document.createElement('p');
            notFound.textContent = 'Товары не найдены';
            this.container.appendChild(notFound);
            return;
        }

        this._cards = items.map(item => {
            const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
            const card = new Card('card', cardElement, {
                onClick: () => this.events.emit('card:select', item)
            });
            
            return card.render({
                title: item.title,
                image: item.image,
                category: item.category,
                price: item.price,
                description: item.description
            });
        });
        
        this.container.innerHTML = '';
        this.container.append(...this._cards);
    }

    render(data?: Partial<IGallery>): HTMLElement {
        if (data && data.items) {
            this.container.replaceChildren(...data.items);
        }
        return this.container;
    }
}