import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { IPagination } from '../shared/interfaces/pagination';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBrand } from '../shared/interfaces/brand';
import { IType } from '../shared/interfaces/productType';
import { SortTypes } from '../shared/custom-types/custom-types';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrlShop: string = `${environment.apiUrl}products`;

  constructor(private http: HttpClient) {}

  getProducts(
    brandId?: number,
    typeId?: number,
    sort?: SortTypes
  ): Observable<IPagination> {
    let params = new HttpParams();

    if (brandId) {
      params = params.append('brandId', brandId.toString());
    }

    if (typeId) {
      params = params.append('typeId', typeId.toString());
    }

    if (sort) {
      params = params.append('sort', sort);
    }

    return this.http
      .get<IPagination>(`${this.baseUrlShop}`, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(`${this.baseUrlShop}/brands`);
  }

  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(`${this.baseUrlShop}/types`);
  }
}
