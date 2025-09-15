import { Injectable } from '@angular/core';
import { StateTableResponse, TableGetDTO } from '../interfaces/ITable';
import { BehaviorSubject, Observable, ReplaySubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  apiUrlTables: string = 'http://localhost:5033/api/Mesa/obtenerMesas';
  apiUrlChangeStateTable: string =
    'http://localhost:5033/api/Mesa/CambiarEstadoMesa/';
  apiUrlGetTableById: string =
    'http://localhost:5033/api/Mesa/ObtenerMesaPorId/';

  private tableSubject = new BehaviorSubject<TableGetDTO[] | null>(null);
  public tables$ = this.tableSubject.asObservable();
  private tableBIdSubject = new BehaviorSubject<TableGetDTO | null>(null);
  public tableBId$ = this.tableBIdSubject.asObservable();

  constructor(private http: HttpClient) {
    this.GetTables();
  }

  GetTables(): void {
    this.http
      .get<TableGetDTO[]>(this.apiUrlTables, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((apidata) => {
          console.log(apidata);
          this.tableSubject.next(apidata);
        }),
      )
      .subscribe();
  }

  ChangeStateTable(idTable: number): Observable<StateTableResponse> {
    return this.http
      .put<StateTableResponse>(this.apiUrlChangeStateTable + idTable, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((apidata) => {
          console.log('Respuesta a cambio de estado de mesa: ', apidata);
        }),
      );
  }

  GetTableById(idTable: number): Observable<TableGetDTO> {
    return this.http
      .get<TableGetDTO>(this.apiUrlGetTableById + idTable, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((apidata) => {
          console.log('Mesa por Id obtenida: ', apidata);
          this.tableBIdSubject.next(apidata);
        }),
      );
  }

  clearTableById(): void {
    this.tableBIdSubject.next(null);
  }
}
