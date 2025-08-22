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
