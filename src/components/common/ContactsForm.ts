import { Form } from './Form';
import { EventEmitter } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IContactsForm, FormErrors } from '../../types';

export interface IContactsFormView extends IContactsForm {
    valid: boolean;
    errors: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        super(cloneTemplate<HTMLFormElement>('#contacts'), events);
        this.events = events;

        this._email = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this._email.addEventListener('input', () => {
            this.events.emit('contacts.email:change', { field: 'email', value: this._email.value });
        });

        this._phone.addEventListener('input', () => {
            this.events.emit('contacts.phone:change', { field: 'phone', value: this._phone.value });
        });
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }

    setFormErrors(value: FormErrors) {
        const errors = Object.values(value).filter(i => !!i).join('; ');
        this.errors = errors;
    }
}