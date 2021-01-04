import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrlOrders: string = `${environment.apiUrl}orders`;

  constructor(private http: HttpClient) {}

  getOrdersForUser() {
    return this.http.get(this.baseUrlOrders);
  }

  getOrderDetailed(id: number) {
    return this.http.get(`${this.baseUrlOrders}/${id}`);
  }
}
