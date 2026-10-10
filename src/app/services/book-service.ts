import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Book } from '../classes/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:5000/api/books';

  private http = inject(HttpClient);

  // C: CREATE - add new book
  public create(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // R: READ - get all books (optional search text and genre filter)
  public getAll(search: string = '', genre: string = ''): Observable<Book[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (genre) params = params.set('genre', genre);
    return this.http.get<Book[]>(this.apiUrl, { params });
  }

  // U: UPDATE
  public update(id: string, book: Book): Observable<Book> {
    return this.http.put<Book>(this.apiUrl + '/' + id, book);
  }

  // D: DELETE
  public delete(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
