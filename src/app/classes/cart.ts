import { Book } from './book';

export interface CartItem {
    book: Book;      // the API sends the full book (populate)
    quantity: number;
}

export interface Cart {
    items: CartItem[];
}
