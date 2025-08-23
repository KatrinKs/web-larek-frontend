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

    protected _toggleModal(state: boolean = true) {
        this.toggleClass(this.container, 'modal_active', state);
    }

    protected _handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    };

    open() {
        this._toggleModal();
        document.addEventListener('keydown', this._handleEscape);
        this.events.emit('modal:open');
    }

    close() {
        this._toggleModal(false);
        document.removeEventListener('keydown', this._handleEscape);
        this._content.replaceChildren();
        this.events.emit('modal:close');
    }
}