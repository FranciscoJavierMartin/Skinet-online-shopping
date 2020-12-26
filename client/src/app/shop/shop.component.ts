import { IType } from './../shared/interfaces/productType';
import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/interfaces/brand';
import { IPagination } from '../shared/interfaces/pagination';
import { IProduct } from '../shared/interfaces/product';
import { ShopService } from './shop.service';
import { SortTypes } from '../shared/custom-types/custom-types';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  brandIdSelected: number = 0;
  typeIdSelected: number = 0;
  sortSelected: SortTypes = 'name';
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
    this.shopService
      .getProducts(this.brandIdSelected, this.typeIdSelected, this.sortSelected)
      .subscribe(
        (response: IPagination) => {
          this.products = response.data;
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
    this.brandIdSelected = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number): void {
    this.typeIdSelected = typeId;
    this.getProducts();
  }

  onSortSelected(sort: SortTypes) {
    this.sortSelected = sort;
    this.getProducts();
  }
}
