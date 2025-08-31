import { Component, OnDestroy, OnInit } from '@angular/core';
import { DishService } from '../../services/dish-service';
import { filter, map, Observable, Subscription } from 'rxjs';
import { DishDTO } from '../../interfaces/IDish';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TablesService } from '../../services/tables-service';
import { TableGetDTO } from '../../interfaces/ITable';
import { OrderPanelComponent } from '../order-panel/order-panel';

@Component({
  selector: 'app-dishes',
  imports: [AsyncPipe, CommonModule, OrderPanelComponent],
  templateUrl: './dishes.html',
  styleUrl: './dishes.css',
})
export class DishesComponent implements OnInit, OnDestroy {
  //Variable observables
  dishes$!: Observable<DishDTO[] | null>;
  countsForCategory$!: Observable<any>;
  tableReceived$!: Observable<TableGetDTO | null>;

  // Variables para muestra de informacion o condicionales
  fromTable: TableGetDTO | null = null;
  suma: number = 0;
  tableReceived: TableGetDTO | null | undefined;

  //Suscriptions
  private tableSubscription: Subscription | undefined;

  public dishes: DishDTO[] = [];
  constructor(
    private _dishService: DishService,
    private _tableService: TablesService,
  ) {}

  ngOnInit(): void {
    this.dishes$ = this._dishService.dishesBC$;

    // OBTENCION DE DATOS SOBRE UNA MESA PARA UN NUEVO PEDIDO
    this.tableSubscription = this._tableService.tableBId$.subscribe((data) => {
      if (!data) {
        this.fromTable = data;
        console.log('No Viene desde una mesa: ', this.fromTable);
      } else {
        this.tableReceived = data;
        this.fromTable = data;
        console.log(this.fromTable);
        console.log('Mesa recibida en dishes:', data);
      }
    });

    this.countsForCategory$ = this._dishService.dishesBC$.pipe(
      map((elements) => {
        if (!elements) {
          console.log('NO hay elementos');
          return {
            'Platos de Fondo': 0,
            Entradas: 0,
            Bebidas: 0,
            Postres: 0,
            Sopas: 0,
            Extras: 0,
          };
        }

        // HACK: Opción 2: Uso de diccionarios
        // const counts: { [key: string]: number } = {
        //   'Platos de Fondo': 0,
        //   Entradas: 0,
        //   Bebidas: 0,
        //   Postres: 0,
        //   Sopas: 0,
        //   Extras: 0,
        // };
        // elements.forEach((element) => {
        //   let nombre = element.categoriaDTO.nombre;
        //   if (counts.hasOwnProperty(nombre)) {
        //     counts[nombre]++;
        //   }
        // });

        let countCategory = new Map();
        countCategory.set('Platos de Fondo', 0);
        countCategory.set('Entradas', 0);
        countCategory.set('Bebidas', 0);
        countCategory.set('Postres', 0);
        countCategory.set('Sopas', 0);
        countCategory.set('Extras', 0);
        countCategory.set('Todos los platos', elements.length);

        elements.forEach((element) => {
          let nombre = element.categoriaDTO.nombre;
          if (countCategory.has(nombre)) {
            countCategory.set(nombre, countCategory.get(nombre) + 1);
          }
        });

        // console.log(
        //   'Elmentos: ',
        //   countCategory,
        //   Array.from(countCategory).map(([name, count]) => ({ name, count })),
        // );
        return Array.from(countCategory).map(([name, count]) => ({
          name,
          count,
        }));
      }),
    );
  }

  datos: DishDTO[] = [];
  isActive: string = '';
  FilterByCategory(category: string) {
    if (category === 'Todos los platos') {
      this.dishes$ = this._dishService.dishesBC$;
    } else {
      this.dishes$ = this._dishService.dishesBC$.pipe(
        map(
          (elements) =>
            elements?.filter((item) => item.categoriaDTO.nombre === category) ??
            [],
        ),
      );
    }
    this.isActive = category;
  }

  // AUMENTAR O REDUCIR CANTIDAD DE PLATOS PARA PEDIDO
  countDish: number | undefined = 0;
  dishId: number = 0;
  countMap: Map<number, [number, string, number]> = new Map();

  ReduceCount(idDish: number, dishName: string, dishPrice: number) {
    this.dishId = idDish;

    // INFO: Decide si darle un valor de 0 en caso de no hallarlo en el map
    // En caso de que si se lo encuentra pero posee el valor de uno o 0 al restarle uno para evitar
    // que sea negativo se le asigna un 0 directamente.
    // O sino si tiene un valor mayor a 0 se le resta 1 a dicho valor.
    if (!this.countMap.has(idDish)) {
      this.countMap.set(idDish, [0, dishName, dishPrice]);
    } else {
      const [cantidad, nombre, precio] = this.countMap.get(idDish) ?? [
        0,
        '',
        0,
      ];
      if (cantidad <= 1) {
        this.countMap.set(idDish, [0, dishName, dishPrice]);
      } else {
        this.countMap.set(idDish, [cantidad - 1, nombre, precio]);
      }
    }

    // Actualizo el map, para recibir cambios en el componente hijo.
    this.countMap = new Map(this.countMap);

    // console.log('Cantidad de platos: ', this.countMap.get(this.dishId));
  }
  IncrementCount(idDish: number, dishName: string, dishPrice: number) {
    this.dishId = idDish;

    // NOTE: Lo mismo, si no está en el map se le ingresa y se le da un valor de 1 por la suma.
    // Si está se le suma 1 al valor que tiene
    if (!this.countMap.has(idDish)) {
      this.countMap.set(idDish, [1, dishName, dishPrice]);
    } else {
      const [cantidad, nombre, precio] = this.countMap.get(idDish) ?? [
        0,
        '',
        0,
      ];
      this.countMap.set(idDish, [cantidad + 1, nombre, precio]);
    }
    this.countMap = new Map(this.countMap);

    // console.log('Cantidad de platos: ', this.countMap.get(this.dishId));
  }

  ngOnDestroy(): void {
    if (this.tableSubscription) this.tableSubscription.unsubscribe();
  }
}
