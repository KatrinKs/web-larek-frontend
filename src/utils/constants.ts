// export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
// export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
const API_ORIGIN = process.env.API_ORIGIN || 'http://localhost:8080';

export const API_URL = `${API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${API_ORIGIN}/content/weblarek`;

export const settings = {
    currency: 'синапсов',
    categoryClasses: {
        'софт-скил': 'card__category_soft',
        'другое': 'card__category_other',
        'дополнительное': 'card__category_additional',
        'кнопка': 'card__category_button',
        'хард-скил': 'card__category_hard',
    }
};

export enum AppEvents {
  CATALOG_CHANGED = 'catalog:changed',
  BASKET_CHANGED = 'basket:changed',
  CARD_SELECT = 'card:select',
  PREVIEW_CHANGED = 'preview:changed',
  BASKET_OPEN = 'basket:open',
  ORDER_READY = 'order:ready',
  ORDER_PAYMENT_CHANGE = 'order.payment:change',
  ORDER_ADDRESS_CHANGE = 'order.address:change',
  ORDER_ERRORS_CHANGE = 'orderErrors:change',
  ORDER_SUBMIT = 'order:submit',
  CONTACTS_EMAIL_CHANGE = 'contacts.email:change',
  CONTACTS_PHONE_CHANGE = 'contacts.phone:change',
  CONTACTS_ERRORS_CHANGE = 'contactsErrors:change',
  CONTACTS_SUBMIT = 'contacts:submit',
  SUCCESS_CLOSE = 'success:close',
  MODAL_OPEN = 'modal:open',
  MODAL_CLOSE = 'modal:close'
}