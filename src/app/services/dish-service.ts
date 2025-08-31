import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { DishDTO } from '../interfaces/IDish';
import { HttpClient } from '@angular/common/http';
import { table } from 'console';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  apiUrlsGetDishesByCategory: string =
    'http://localhost:5033/api/Producto/ObtenerProductosPorCategoria/';

  private dishesBC = new BehaviorSubject<DishDTO[] | null>(null);
  public dishesBC$ = this.dishesBC.asObservable();

  constructor(private http: HttpClient) {
    this.GetDishesBC('ew');
  }

  GetDishesBC(category: string): void {
    this.http
      .get<DishDTO[]>(this.apiUrlsGetDishesByCategory + category, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((apidata) => {
          apidata.filter((element) => {
            element.categoriaDTO.nombre == category;
          });
          this.dishesBC.next(apidata);
        }),
      )
      .subscribe();
  }
}
