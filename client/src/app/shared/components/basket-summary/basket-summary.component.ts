import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasketItem } from '../../interfaces/basket';
import { IOrderItem } from '../../interfaces/order';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss'],
})
export class BasketSummaryComponent implements OnInit {
  @Output()
  decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output()
  increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Input() isBasket: boolean = true;
  @Input() items: IBasketItem[] | IOrderItem[] = [];
  @Input() isOrder: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  decrementItemQuantity(item: IBasketItem): void {
    this.decrement.emit(item);
  }

  incrementItemQuantity(item: IBasketItem): void {
    this.increment.emit(item);
  }

  removeBasketItem(item: IBasketItem): void {
    this.remove.emit(item);
  }
}
