import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStateItemResponse, OrdersWIDTO } from '../interfaces/IOrder';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrlOrderWithItems: string = "http://localhost:5033/api/Pedido/ObtenerTodosLosPedidosConItems";
  private apiUrlKitchenOrders: string = "http://localhost:5033/api/Pedido/ObtenerComandasCocina";
  private apiUrlChangeItemState: string = "http://localhost:5033/api/ItemPedido/CambiarEstadoItem/";

  private ordersWithItemsSubject = new BehaviorSubject<OrdersWIDTO[] | null>(null);
  public orderWI$ = this.ordersWithItemsSubject.asObservable();

  private kitcherOrdersSubject = new BehaviorSubject<OrdersWIDTO[] | null>(null);
  public kOrders$ = this.kitcherOrdersSubject.asObservable();



  constructor(private http: HttpClient) {
    // this.GetOrdersWithItems();
    this.GetKitcherOrders();
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

  GetKitcherOrders(): void {
    this.http.get<OrdersWIDTO[]>(this.apiUrlKitchenOrders, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(apidata => {
        console.log("Pedidos con Items: ", apidata);
        this.kitcherOrdersSubject.next(apidata);
      })
    ).subscribe();
  }


  ChangeStateItem(idItem: number): Observable<ChangeStateItemResponse | undefined> {
    return this.http.put<ChangeStateItemResponse>(this.apiUrlChangeItemState + idItem, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(apidata => {
        console.log("Pedidos con Items: ", apidata);
      })
    )
  }


}
