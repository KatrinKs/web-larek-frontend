import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IOrderForm, FormErrors } from '../../types';

export interface IOrderFormView extends IOrderForm {
    valid: boolean;
    errors: FormErrors;
}

export class OrderForm extends Component<IOrderFormView> {
    protected _buttons: HTMLButtonElement[];
    protected _input: HTMLInputElement;
    protected _errors: HTMLElement;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        super(cloneTemplate<HTMLFormElement>('#order'));
        this.events = events;

        this._buttons = Array.from(this.container.querySelectorAll('.button_alt'));
        this._input = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                this.events.emit('order.payment:change', { field: 'payment', value: button.name });
            });
        });

        this._input.addEventListener('input', () => {
            this.events.emit('order.address:change', { field: 'address', value: this._input.value });
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit('order:submit');
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

    set valid(value: boolean) {
        this.setDisabled(ensureElement<HTMLButtonElement>('button[type="submit"]', this.container), !value);
    }

    set errors(value: FormErrors) {
        const errors = Object.values(value).filter(i => !!i).join('; ');
        this.setText(this._errors, errors);
    }
}