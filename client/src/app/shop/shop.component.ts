import { IType } from './../shared/interfaces/productType';
import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/interfaces/brand';
import { IPagination } from '../shared/interfaces/pagination';
import { IProduct } from '../shared/interfaces/product';
import { ShopService } from './shop.service';
import { SortTypes } from '../shared/custom-types/custom-types';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions: { name: string; value: SortTypes }[] = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts(): void {
    this.shopService.getProducts(this.shopParams).subscribe(
      (response: IPagination) => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getBrands(): void {
    this.shopService.getBrands().subscribe((response: IBrand[]) => {
      this.brands = [{ id: 0, name: 'All' }, ...response];
    });
  }

  getTypes(): void {
    this.shopService.getTypes().subscribe((response: IType[]) => {
      this.types = [{ id: 0, name: 'All' }, ...response];
    });
  }

  onBrandSelected(brandId: number): void {
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number): void {
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(sort: SortTypes) {
    this.shopParams.sort = sort;
    this.getProducts();
  }

  onPageChanged(pageNumber: number) {
    this.shopParams.pageNumber = pageNumber;
    this.getProducts();
  }
}
