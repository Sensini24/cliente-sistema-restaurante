import { Component, OnInit } from '@angular/core';
import { OrdersWIDTO } from '../../interfaces/IOrder';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { OrderWService } from '../../services/order-wservice';
import { ItemService } from '../../services/item-service';
import { OrdersService } from '../../services/orders-service';

@Component({
  selector: 'app-orders-all',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './orders-waiter.html',
  styleUrl: './orders-waiter.css',
})
export class OrdersWaiterComponent implements OnInit {
  orderWDTO$!: Observable<OrdersWIDTO[] | null>;

  constructor(
    private _orderWService: OrderWService,
    private _orderService: OrdersService,
    private _itemService: ItemService,
  ) {}

  ngOnInit(): void {
    this.orderWDTO$ = this._orderWService.orderW$;
  }

  changeStateItem(idItem: number): void {
    this._itemService.ChangeStateItem(idItem).subscribe(() => {
      this._orderService.GetKitcherOrders('All');

      // NOTE: Actualizamos la lista de pedidos para mozo para que se muestren los
      // nuevos estados.
      this._orderWService.GetOrdersWaiter();
    });
  }
}
