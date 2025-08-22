import { Component } from '../base/Component';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { settings } from '../../utils/constants';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    description?: string;
    image?: string;
    category?: string;
    price?: number | null;
    selected?: boolean;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price?: HTMLElement;
    protected _category?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set description(value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) {
                this.setDisabled(this._button, true);
                this.setText(this._button, 'Недоступно');
            }
        } else {
            this.setText(this._price, `${value} ${settings.currency}`);
            if (this._button) {
                this.setDisabled(this._button, false);
            }
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = settings.categoryClasses[value as keyof typeof settings.categoryClasses] || '';
            this._category.className = `${this.blockName}__category ${categoryClass}`;
        }
    }

    set selected(value: boolean) {
        if (this._button) {
            if (value) {
                this.setText(this._button, 'Убрать из корзины');
                this._button.classList.add('card__button_selected');
            } else {
                this.setText(this._button, 'Купить');
                this._button.classList.remove('card__button_selected');
            }
        }
    }
}