import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  OrderCreateDTO,
  OrdersWIDTO,
  StateOrderResponse,
} from '../interfaces/IOrder';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrlOrderWithItems: string =
    'http://localhost:5033/api/Pedido/ObtenerTodosLosPedidosConItems';

  private apiUrlKitchenOrders: string =
    'http://localhost:5033/api/Pedido/ObtenerComandasCocina';

  private apiUrlCancelOrder: string =
    'http://localhost:5033/api/Pedido/CancelarPedido/';

  private apirUrlOrderById: string =
    'http://localhost:5033/api/Pedido/ObtenerPedidoPorId/';

  private apiUrlSaveOrder: string =
    'http://localhost:5033/api/Pedido/CrerPedido/';

  private apiUrlGetOrderByTableId =
    'http://localhost:5033/api/Pedido/ObtenerPedidoPorIdMesa/';

  private ordersWithItemsSubject = new BehaviorSubject<OrdersWIDTO[] | null>(
    null,
  );
  public orderWI$ = this.ordersWithItemsSubject.asObservable();

  private kitcherOrdersSubject = new BehaviorSubject<OrdersWIDTO[] | null>(
    null,
  );
  public kOrders$ = this.kitcherOrdersSubject.asObservable();

  private orderByIdSubject = new BehaviorSubject<OrdersWIDTO | null>(null);
  public orderBId$ = this.orderByIdSubject.asObservable();

  private makesOrderSubjet = new BehaviorSubject<OrdersWIDTO | null>(null);
  public makesOrder$ = this.makesOrderSubjet.asObservable();

  private getOrderByTableIdSubject = new BehaviorSubject<OrdersWIDTO | null>(
    null,
  );
  public getOrderBTId$ = this.getOrderByTableIdSubject.asObservable();

  constructor(private http: HttpClient) {
    this.GetOrdersWithItems();
    this.GetKitcherOrders('All');
  }

  GetOrdersWithItems(): void {
    this.http
      .get<OrdersWIDTO[]>(this.apiUrlOrderWithItems, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((apidata) => {
          console.log('Pedidos con Items: ', apidata);
          this.ordersWithItemsSubject.next(apidata);
        }),
      )
      .subscribe();
  }

  GetKitcherOrders(stateOrder: string): void {
    this.http
      .get<OrdersWIDTO[]>(this.apiUrlKitchenOrders, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((apidata) => {
          console.log('Pedidos con Items: ', apidata);
          if (stateOrder == 'All') {
            this.kitcherOrdersSubject.next(apidata);
          } else {
            var datos = apidata.filter((e) => e.estado == stateOrder);
            this.kitcherOrdersSubject.next(datos);
          }
        }),
        catchError((error) => {
          console.error(`Error al obtener comandas para la cocina`, error);
          this.orderByIdSubject.next(null);
          return of(null);
        }),
      )
      .subscribe();
  }

  GetOrderById(idOrder: number): Observable<OrdersWIDTO | null> {
    return this.http
      .get<OrdersWIDTO>(this.apirUrlOrderById + idOrder, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((apidata) => {
          this.orderByIdSubject.next(apidata);
          console.log('Obtencion de order por id en service: ', apidata);
        }),
        catchError((error) => {
          console.error(
            `Error al obtener comandas para la mesa ${idOrder}:`,
            error,
          );
          this.orderByIdSubject.next(null);
          return of(null);
        }),
      );
  }

  GetOrderByTable(idMesa: number): Observable<OrdersWIDTO | undefined | null> {
    return this.http
      .get<OrdersWIDTO>(this.apiUrlGetOrderByTableId + idMesa, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((apidata) => {
          this.getOrderByTableIdSubject.next(apidata);
        }),
        catchError((error) => {
          console.error(
            `Error al obtener el pedido por id mesa ${idMesa}:`,
            error,
          );
          this.orderByIdSubject.next(null);
          return of(null);
        }),
      );
  }

  CancelOrder(idOrder: number): Observable<StateOrderResponse | undefined> {
    return this.http
      .put<StateOrderResponse>(this.apiUrlCancelOrder + idOrder, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((apidata) => {
          console.log('Pedidos con Items: ', apidata.mensaje);
        }),
      );
  }

  CreatesOrder(orderDTO: OrderCreateDTO): Observable<any | undefined> {
    return this.http
      .post<any>(this.apiUrlSaveOrder, orderDTO, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .pipe(
        tap((apidata) => {
          console.log('Respuesta a crear pedido: ', apidata);
          this.makesOrderSubjet.next(apidata);
        }),
      );
  }
}
