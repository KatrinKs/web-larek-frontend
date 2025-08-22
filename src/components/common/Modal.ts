import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        super(ensureElement<HTMLElement>('#modal-container'));
        this.events = events;

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this._content = ensureElement<HTMLElement>('.modal__content', this.container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.toggleClass(this.container, 'modal_active', true);
        this.events.emit('modal:open');
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
        this._content.replaceChildren();
        this.events.emit('modal:close');
    }
}