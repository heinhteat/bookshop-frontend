import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../classes/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:5000/api/categories';

  private http = inject(HttpClient);

  // C: CREATE
  public create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  // R: READ
  public getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // U: UPDATE
  public update(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(this.apiUrl + '/' + id, category);
  }

  // D: DELETE
  public delete(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
