import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';
import { IDeliveryMethod } from '../shared/interfaces/deliveryMethod';
import { IOrder, IOrderToCreate } from '../shared/interfaces/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrlCheckout: string = `${environment.apiUrl}orders/`;

  constructor(private http: HttpClient) {}

  createOrder(order: IOrderToCreate): Observable<IOrder> {
    return this.http.post<IOrder>(`${this.baseUrlCheckout}`, order);
  }

  getDeliveryMethod() {
    return this.http.get(`${this.baseUrlCheckout}deliveryMethods`).pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }
}
