import { Component, OnInit } from '@angular/core';
import { OrdersWIDTO } from '../../interfaces/IOrder';
import { map, Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { OrdersService } from '../../services/orders-service';
import { ItemService } from '../../services/item-service';
import { OrderWService } from '../../services/order-wservice';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent implements OnInit {
  orderWI$!: Observable<OrdersWIDTO[] | null>;
  KOrders$!: Observable<OrdersWIDTO[] | null>;
  kordersArray: OrdersWIDTO[] = [];
  stateCount$!: Observable<any>;

  // Filtrados
  pendingOrders$!: Observable<OrdersWIDTO[] | null>;
  readyOrders$!: Observable<OrdersWIDTO[] | null>;
  allOrders$!: Observable<OrdersWIDTO[] | null>;
  filterOrders$!: Observable<OrdersWIDTO[] | null>;

  constructor(
    private _orderService: OrdersService,
    private _orderWService: OrderWService,
    private _itemService: ItemService,
  ) {}

  ngOnInit(): void {
    this.KOrders$ = this._orderService.kOrders$;
    this.filterOrders$ = this.KOrders$;
    // this._orderService.GetKitcherOrders("All").subscribe(apidata => {
    //   this.kordersArray = apidata
    // });
    //
    this.stateCount$ = this._orderService.kOrders$.pipe(
      map((orders) => {
        if (!orders) {
          return { preparing: 0, ready: 0, partiallyReady: 0 };
        }

        const ready = orders.filter((order) => order.estado === 'Listo').length;
        const preparing = orders.filter(
          (order) => order.estado === 'En Preparacion',
        ).length;
        const partiallyReady = orders.filter(
          (order) => order.estado === 'Parcialmente Listo',
        ).length;

        return { ready, preparing, partiallyReady };
      }),
    );
  }

  changeStateItem(idItem: number): void {
    this._itemService.ChangeStateItem(idItem).subscribe(() => {
      this._orderService.GetKitcherOrders('All');

      // NOTE: Actualizamos la lista de pedidos para mozo para que se muestren los
      // nuevos estados.

      this._orderWService.GetOrdersWaiter();
    });
  }

  getAll() {
    this.filterOrders$ = this.KOrders$;
  }

  getPreparing() {
    // this._orderService.GetKitcherOrders("En Preparacion");
    this.filterOrders$ = this.KOrders$.pipe(
      map((x) => {
        if (!x) {
          return null;
        }
        return x.filter((x) => x.estado == 'En Preparacion');
      }),
    );
  }

  getListo() {
    this.filterOrders$ = this.KOrders$.pipe(
      map((x) => {
        if (!x) {
          return null;
        }
        return x.filter((x) => x.estado == 'Listo');
      }),
    );
  }

  getParcialmenteListo() {
    // this._orderService.GetKitcherOrders("Listo");
    this.filterOrders$ = this.KOrders$.pipe(
      map((x) => {
        if (!x) {
          return null;
        }
        return x.filter((x) => x.estado == 'Parcialmente Listo');
      }),
    );
  }

  cancelOrder(idOrder: number): void {
    this._orderService.CancelOrder(idOrder).subscribe(() => {
      this._orderService.GetKitcherOrders('All');
    });
  }
}
