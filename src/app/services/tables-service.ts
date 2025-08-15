import { Injectable } from '@angular/core';
import { TableGetDTO } from '../interfaces/ITable';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  apiUrlTables: string = "http://localhost:5033/api/Mesa/obtenerMesas";

  private tableSubject = new BehaviorSubject<TableGetDTO[] | null>(null);
  public tables$ = this.tableSubject.asObservable();

  constructor(private http: HttpClient) {
    this.GetTables();
  }

  GetTables(): void {
    this.http.get<TableGetDTO[]>(this.apiUrlTables, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(apidata => {
        console.log(apidata)
        this.tableSubject.next(apidata);
      })
    ).subscribe();
  }

}
