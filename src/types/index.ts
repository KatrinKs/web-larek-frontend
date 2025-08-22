export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IOrderForm {
    payment: string;
    address: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm, IContactsForm {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder;
    loading: boolean;
}