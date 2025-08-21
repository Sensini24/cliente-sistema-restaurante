import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateItemResponse } from '../interfaces/IItem';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrlChangeItemState: string = "http://localhost:5033/api/ItemPedido/CambiarEstadoItem/";

  constructor(private http: HttpClient) {
  }

  ChangeStateItem(idItem: number): Observable<StateItemResponse | undefined> {
    return this.http.put<StateItemResponse>(this.apiUrlChangeItemState + idItem, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(apidata => {
        console.log("Pedidos con Items: ", apidata);
      })
    )
  }
}
