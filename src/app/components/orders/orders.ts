import { Component, OnInit } from '@angular/core';
import { OrdersWIDTO } from '../../interfaces/IOrder';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { OrdersService } from '../../services/orders-service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {
  orderWI$!: Observable<OrdersWIDTO[] | null>;
  kOrders$!: Observable<OrdersWIDTO[] | null>;

  constructor(private _orderService: OrdersService) {
  }

  ngOnInit(): void {
    // this.orderWI$ = this._orderService.orderWI$;
    this.kOrders$ = this._orderService.kOrders$;
  }

  changeStateItem(idItem: number): void {
    this._orderService.ChangeStateItem(idItem)
      .subscribe(() => {
        this._orderService.GetKitcherOrders();
      });
  }
}
