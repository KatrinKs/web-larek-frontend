import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _closeButton: HTMLButtonElement;
    protected _description: HTMLElement;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        super(cloneTemplate<HTMLElement>('#success'));
        this.events = events;

        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);

        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}