import { Form } from './Form';
import { EventEmitter } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IOrderForm, FormErrors } from '../../types';

export interface IOrderFormView extends IOrderForm {
    valid: boolean;
    errors: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _buttons: HTMLButtonElement[];
    protected _input: HTMLInputElement;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        super(cloneTemplate<HTMLFormElement>('#order'), events);
        this.events = events;

        this._buttons = Array.from(this.container.querySelectorAll('.button_alt'));
        this._input = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                this.events.emit('order.payment:change', { field: 'payment', value: button.name });
            });
        });

        this._input.addEventListener('input', () => {
            this.events.emit('order.address:change', { field: 'address', value: this._input.value });
        });
    }

    set payment(value: string) {
        this._buttons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this._input.value = value;
    }

    setFormErrors(value: FormErrors) {
        const errors = Object.values(value).filter(i => !!i).join('; ');
        this.errors = errors;
    }
}