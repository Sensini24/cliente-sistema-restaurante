import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { OrdersWIDTO } from '../interfaces/IOrder';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderWService {

  private apiUrlOrderWaiter: string = "http://localhost:5033/api/Pedido/ObtenerPedidosMozo";


  private ordersWaiterSubject = new BehaviorSubject<OrdersWIDTO[] | null>(null);
  public orderW$ = this.ordersWaiterSubject.asObservable();


  constructor(private http: HttpClient) {
    this.GetOrdersWaiter();
  }


  // NOTE: Obtención de pedidos para mozo. Se evita "En Preparacion" y "Pagado"
  GetOrdersWaiter(): void {
    this.http.get<OrdersWIDTO[]>(this.apiUrlOrderWaiter, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(apidata => {
        console.log("Pedidos con Items: ", apidata);
        this.ordersWaiterSubject.next(apidata);
      })
    ).subscribe();
  }

}
