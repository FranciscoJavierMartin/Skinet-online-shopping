import { SortTypes } from '../custom-types/custom-types';

export class ShopParams {
  brandId: number = 0;
  typeId: number = 0;
  sort: SortTypes = 'name';
  pageNumber: number = 1;
  pageSize: number = 6;
}
