import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { IPagination } from '../shared/interfaces/pagination';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBrand } from '../shared/interfaces/brand';
import { IType } from '../shared/interfaces/productType';
import { SortTypes } from '../shared/custom-types/custom-types';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrlShop: string = `${environment.apiUrl}products`;

  constructor(private http: HttpClient) {}

  getProducts(shopParams: ShopParams): Observable<IPagination> {
    let params = new HttpParams();

    if (shopParams.brandId) {
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

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

  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrlShop}/${id}`);
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(`${this.baseUrlShop}/brands`);
  }

  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(`${this.baseUrlShop}/types`);
  }
}
