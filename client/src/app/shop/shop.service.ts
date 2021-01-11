import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination, Pagination } from '../shared/interfaces/pagination';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBrand } from '../shared/interfaces/brand';
import { IType } from '../shared/interfaces/productType';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrlShop: string = `${environment.apiUrl}products`;
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination: Pagination = new Pagination();
  shopParams = new ShopParams();

  constructor(private http: HttpClient) {}

  getProducts(useCache: boolean): Observable<IPagination> {
    if (!useCache) {
      this.products = [];
    }

    if (this.products.length > 0 && useCache) {
      const pagesReveiced = Math.ceil(
        this.products.length / this.shopParams.pageSize
      );

      if (this.shopParams.pageNumber <= pagesReveiced) {
        this.pagination.data = this.products.slice(
          (this.shopParams.pageNumber - 1) * this.shopParams.pageSize,
          this.shopParams.pageNumber * this.shopParams.pageSize
        );

        return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if (this.shopParams.brandId) {
      params = params.append('brandId', this.shopParams.brandId.toString());
    }

    if (this.shopParams.typeId) {
      params = params.append('typeId', this.shopParams.typeId.toString());
    }

    if (this.shopParams.search) {
      params = params.append('search', this.shopParams.search);
    }

    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageSize.toString());

    return this.http
      .get<IPagination>(`${this.baseUrlShop}`, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          this.products = [...this.products, ...response.body.data];
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  setShopParams(params: ShopParams): void {
    this.shopParams = params;
  }

  getShopParams(): ShopParams {
    return this.shopParams;
  }

  getProduct(id: number): Observable<IProduct> {
    const product = this.products.find((p) => p.id === id);
    return product
      ? of(product)
      : this.http.get<IProduct>(`${this.baseUrlShop}/${id}`);
  }

  getBrands(): Observable<IBrand[]> {
    return this.brands.length > 0
      ? of(this.brands)
      : this.http.get<IBrand[]>(`${this.baseUrlShop}/brands`).pipe(
          map((response) => {
            this.brands = response;
            return response;
          })
        );
  }

  getTypes(): Observable<IType[]> {
    return this.types.length > 0
      ? of(this.types)
      : this.http.get<IType[]>(`${this.baseUrlShop}/types`).pipe(
          map((response) => {
            this.types = response;
            return response;
          })
        );
  }
}
