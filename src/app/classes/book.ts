export interface Book {
    _id?: string;
    title: string;
    author: string;
    isbn: string;
    genre: string;
    description: string;
    price: number;
    stock: number;
    bookType: 'physical' | 'ebook';
    discount: number; // percent 0-100
    image: string;
}
