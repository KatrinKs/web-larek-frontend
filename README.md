# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Web-ларёк - это интернет-магазин товаров для веб-разработчиков. Приложение позволяет просматривать каталог товаров, добавлять товары в корзину и оформлять заказы.

## Архитектура проекта

Проект использует архитектурный паттерн MVP (Model-View-Presenter) с элементами Event-Driven Architecture.

Слои приложения:
    1. Модель (Model) - управление данными и бизнес-логикой

    2. Представление (View) - отображение данных и обработка пользовательского ввода

    3. Презентер (Presenter) - координация между Model и View (реализован в основном скрипте)

Взаимодействие между слоями организовано через систему событий (EventEmitter), что обеспечивает слабую связность компонентов.

## Слой Модели (Model)
Класс AppData

Назначение: Центральное хранилище состояния приложения, управление бизнес-логикой.

Конструктор:

```typescript
constructor(protected events: EventEmitter)
```

Принимает экземпляр EventEmitter для генерации событий.

Поля:

    catalog: IProduct[] - массив всех товаров

    basket: string[] - массив ID товаров в корзине

    order: IOrder - объект с данными текущего заказа

    preview: string | null - ID товара для предпросмотра

    loading: boolean - флаг загрузки данных

Методы:

    setCatalog(items: IProduct[]) - установка каталога товаров

    addToBasket(item: IProduct) - добавление товара в корзину

    removeFromBasket(id: string) - удаление товара из корзины

    getTotal(): number - расчет общей суммы корзины

    validateOrder(): boolean - валидация данных заказа

    validateContacts(): boolean - валидация контактных данных

    isInBasket(item: IProduct): boolean - проверка наличия товара в корзине

## Слой Представления (View)
Базовый класс Component<T>

Назначение: Базовый класс для всех UI компонентов, предоставляет общие методы работы с DOM.

Конструктор:

```typescript
constructor(protected readonly container: HTMLElement)
```

Принимает корневой DOM-элемент компонента.

Методы:

    render(data?: Partial<T>) - отрисовка компонента с данными

    setText(element, value) - установка текстового содержимого

    setImage(element, src, alt) - установка изображения

    setDisabled(element, state) - управление состоянием disabled

    toggleClass(element, className, force) - управление CSS классами

## Класс Page

Назначение: Главный компонент страницы, управляет основным layout.

Поля:

    _counter: HTMLElement - элемент счетчика корзины

    _catalog: HTMLElement - контейнер галереи товаров

    _wrapper: HTMLElement - основной wrapper страницы

    _basket: HTMLElement - кнопка корзины

Сеттеры:

    counter: number - установка значения счетчика

    catalog: HTMLElement[] - установка элементов каталога

    locked: boolean - блокировка интерфейса

## Класс Modal

Назначение: Универсальный компонент модального окна.

Поля:

    _closeButton: HTMLButtonElement - кнопка закрытия

    _content: HTMLElement - контейнер содержимого

Методы:

    open() - открытие модального окна

    close() - закрытие модального окна

    content: HTMLElement - установка содержимого

## Класс Card

Назначение: Компонент карточки товара для различных контекстов (каталог, корзина, превью).

Поля:

    _title: HTMLElement - заголовок товара

    _image: HTMLImageElement - изображение товара

    _price: HTMLElement - цена товара

    _category: HTMLElement - категория товара

    _description: HTMLElement - описание товара

    _button: HTMLButtonElement - кнопка действия

Сеттеры:

    title: string - установка заголовка

    image: string - установка изображения

    price: number | null - установка цены

    category: string - установка категории

    selected: boolean - состояние кнопки (Купить/Убрать)

## Класс Basket

Назначение: Компонент корзины товаров.

Поля:

    _list: HTMLElement - список товаров

    _total: HTMLElement - элемент общей суммы

    _button: HTMLButtonElement - кнопка оформления

Сеттеры:

    items: HTMLElement[] - установка элементов корзины

    total: number - установка общей суммы

    selected: boolean - активность кнопки оформления

## Класс Gallery

Назначение: Компонент галереи товаров.

Методы:

    update(items: IProduct[]) - обновление списка товаров

Класс OrderForm

Назначение: Форма оформления заказа (способ оплаты и адрес).

Поля:

    _buttons: HTMLButtonElement[] - кнопки выбора оплаты

    _input: HTMLInputElement - поле ввода адреса

    _errors: HTMLElement - контейнер ошибок

Сеттеры:

    payment: string - установка способа оплаты

    address: string - установка адреса

    valid: boolean - валидность формы

    errors: FormErrors - отображение ошибок

## Класс ContactsForm

Назначение: Форма ввода контактных данных.

Поля:

    _email: HTMLInputElement - поле email

    _phone: HTMLInputElement - поле телефона

    _errors: HTMLElement - контейнер ошибок

Сеттеры:

    email: string - установка email

    phone: string - установка телефона

    valid: boolean - валидность формы

    errors: FormErrors - отображение ошибок

## Класс Success

Назначение: Компонент успешного оформления заказа.

Поля:

    _closeButton: HTMLButtonElement - кнопка закрытия

    _description: HTMLElement - описание с суммой

Сеттер:

    total: number - установка суммы заказа

## Типы данных
IProduct

```typescript
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

IOrder

```typescript
interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: string[];
    total: number;
}
```

IOrderResult

```typescript
interface IOrderResult {
    id: string;
    total: number;
}
```

FormErrors

```typescript
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Взаимодействие компонентов через события
Пример: Добавление товара в корзину

    View (Card): Пользователь нажимает на кнопку "Купить" в карточке товара
        Генерируется событие: card:select с данными товара

    Presenter (index.ts): Обрабатывает событие card:select
        Вызывает метод модели: appData.setPreview(item)

    Model (AppData): Обновляет состояние
        Устанавливает preview = item.id

        Генерирует событие: preview:changed с данными товара

    Presenter: Обрабатывает событие preview:changed
        Создает компонент Card для превью

        Устанавливает содержимое модального окна: modal.content = cardElement

        Открывает модальное окно: modal.open()

    View (Modal): Отображает детальную информацию о товаре

Пример: Оформление заказа

    View (Basket): Пользователь кликает "Оформить" в корзине
        Генерируется событие: order:ready

    Presenter: Обрабатывает событие order:ready
        Создает форму заказа с текущими данными

        Открывает модальное окно с формой

    View (OrderForm): Пользователь заполняет данные
        Изменения полей генерируют события: order.payment:change, order.address:change

    Presenter: Обрабатывает события полей
        Обновляет модель: appData.setOrderField(field, value)

    Model: Валидирует данные и генерирует события ошибок
        orderErrors:change или contactsErrors:change

    View: Отображает ошибки валидации

## Система событий
Основные события:

    catalog:changed - изменение каталога товаров

    basket:changed - изменение содержимого корзины

    card:select - выбор товара для просмотра

    preview:changed - изменение товара для превью

    order:ready - готовность к оформлению заказа

    order:submit - отправка формы заказа

    contacts:submit - отправка контактных данных

    modal:open, modal:close - упра

    вление модальными окнами

    success:close - закрытие окна успеха
