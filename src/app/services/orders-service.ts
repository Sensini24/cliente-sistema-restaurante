import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrdersWIDTO, StateOrderResponse } from '../interfaces/IOrder';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrlOrderWithItems: string = "http://localhost:5033/api/Pedido/ObtenerTodosLosPedidosConItems";
  private apiUrlKitchenOrders: string = "http://localhost:5033/api/Pedido/ObtenerComandasCocina";
  private apiUrlCancelOrder: string = "http://localhost:5033/api/Pedido/CancelarPedido/";


  private ordersWithItemsSubject = new BehaviorSubject<OrdersWIDTO[] | null>(null);
  public orderWI$ = this.ordersWithItemsSubject.asObservable();

  private kitcherOrdersSubject = new BehaviorSubject<OrdersWIDTO[] | null>(null);
  public kOrders$ = this.kitcherOrdersSubject.asObservable();



  constructor(private http: HttpClient) {
    this.GetOrdersWithItems();
    this.GetKitcherOrders("All");
  }

  GetOrdersWithItems(): void {
    this.http.get<OrdersWIDTO[]>(this.apiUrlOrderWithItems, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(apidata => {
        console.log("Pedidos con Items: ", apidata);
        this.ordersWithItemsSubject.next(apidata);
      })
    ).subscribe();
  }

  GetKitcherOrders(stateOrder: string): void {
    this.http.get<OrdersWIDTO[]>(this.apiUrlKitchenOrders, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(apidata => {
        console.log("Pedidos con Items: ", apidata);
        if (stateOrder == "All") {
          this.kitcherOrdersSubject.next(apidata);
        } else {
          var datos = apidata.filter(e => e.estado == stateOrder);
          this.kitcherOrdersSubject.next(datos);
        }
      })
    ).subscribe();
  }

  CancelOrder(idOrder: number): Observable<StateOrderResponse | undefined> {
    return this.http.put<StateOrderResponse>(this.apiUrlCancelOrder + idOrder, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(apidata => {
        console.log("Pedidos con Items: ", apidata.mensaje);
      })
    )
  }

}
