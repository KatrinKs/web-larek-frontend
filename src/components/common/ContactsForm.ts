import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IContactsForm, FormErrors } from '../../types';

export interface IContactsFormView extends IContactsForm {
    valid: boolean;
    errors: FormErrors;
}

export class ContactsForm extends Component<IContactsFormView> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _errors: HTMLElement;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        super(cloneTemplate<HTMLFormElement>('#contacts'));
        this.events = events;

        this._email = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this._email.addEventListener('input', () => {
            this.events.emit('contacts.email:change', { field: 'email', value: this._email.value });
        });

        this._phone.addEventListener('input', () => {
            this.events.emit('contacts.phone:change', { field: 'phone', value: this._phone.value });
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }

    set valid(value: boolean) {
        this.setDisabled(ensureElement<HTMLButtonElement>('button[type="submit"]', this.container), !value);
    }

    set errors(value: FormErrors) {
        const errors = Object.values(value).filter(i => !!i).join('; ');
        this.setText(this._errors, errors);
    }
}