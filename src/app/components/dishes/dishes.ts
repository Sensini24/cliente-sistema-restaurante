import { Component, OnDestroy, OnInit } from '@angular/core';
import { DishService } from '../../services/dish-service';
import { combineLatest, filter, map, Observable, Subscription } from 'rxjs';
import { DishDTO } from '../../interfaces/IDish';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TablesService } from '../../services/tables-service';
import { TableGetDTO } from '../../interfaces/ITable';
import { OrderPanelComponent } from '../order-panel/order-panel';
import { OrdersService } from '../../services/orders-service';
import { OrdersWIDTO } from '../../interfaces/IOrder';

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
  showOrderPanel: boolean = false;
  showDishes: boolean = false;
  showPanelUpdate: boolean = false;

  //Variables para almacenamiento de objetos
  orderByIdFromDishes: OrdersWIDTO | undefined;

  //Suscriptions
  private tableSubscription: Subscription | undefined;
  private orderSubscription: Subscription | undefined;

  public dishes: DishDTO[] = [];

  //Map para almacenar eleccion de dishes
  countMap: Map<number, [number, string, number]> = new Map();

  constructor(
    private _dishService: DishService,
    private _tableService: TablesService,
    private _orderService: OrdersService,
  ) {}

  ngOnInit(): void {
    this.dishes$ = this._dishService.dishesBC$;

    // OBTENCION DE DATOS SOBRE UNA MESA PARA UN NUEVO PEDIDO
    this.tableSubscription = this._tableService.tableBId$.subscribe((data) => {
      if (!data) {
        this.fromTable = data;
        this.showOrderPanel = false;
        console.log('No Viene desde una mesa: ', this.fromTable);
      } else {
        this.tableReceived = data;
        this.fromTable = data;
        this.showOrderPanel = true;
        this.showDishes = true;
        console.log(this.fromTable);
        console.log('Mesa recibida en dishes:', data);
      }
    });

    //OBTENCION DE PEDIDO DESDE MESAS
    this.orderSubscription = this._orderService.orderBId$.subscribe((data) => {
      if (!data) {
        this.showPanelUpdate = false;
      } else {
        this.showPanelUpdate = true;
        this.showDishes = true;
        this.orderByIdFromDishes = data;
      }
    });

    if (this.orderByIdFromDishes) {
      this.orderByIdFromDishes.itempedidos.forEach((elem) => {
        this.countMap.set(elem.productoid, [
          elem.cantidad,
          elem.nombreProducto,
          elem.preciounitario,
        ]);
      });
    }

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
        // Se quita el item en caso de que tenga cantidad de 0
        if (this.countMap.get(idDish)) {
          this.countMap.delete(idDish);

          //Filtrar lista de muestra en el panel de actualizacion para quitar los que no tengan cantidad
          this.removeItemOfOrderById(idDish);
          console.log('orden actual: ', this.orderByIdFromDishes);
        }
      } else {
        this.countMap.set(idDish, [cantidad - 1, nombre, precio]);
        //Reducir cantidad de elementos en el panel de actualización
        if (this.orderByIdFromDishes) {
          this.orderByIdFromDishes.itempedidos =
            this.orderByIdFromDishes?.itempedidos.map((elem) => {
              if (elem.productoid === idDish) {
                return { ...elem, cantidad: elem.cantidad - 1 };
              }
              return elem;
            });
        }
      }

      console.log('COUNT MAP: ', this.countMap);
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

      //Incrementar cantidad de los elementos de panel de actualización
      this.incrCountOfOrderById(idDish);
    }
    this.countMap = new Map(this.countMap);
    console.log('COUNT MAP: ', this.countMap);
    // console.log('Cantidad de platos: ', this.countMap.get(this.dishId));
  }

  incrCountOfOrderById(idDish: number) {
    if (this.orderByIdFromDishes) {
      this.orderByIdFromDishes.itempedidos =
        this.orderByIdFromDishes?.itempedidos.map((elem) => {
          if (elem.productoid === idDish) {
            return { ...elem, cantidad: elem.cantidad + 1 };
          }
          return elem;
        });
    }
  }

  removeItemOfOrderById(idDish: number) {
    if (this.orderByIdFromDishes) {
      this.orderByIdFromDishes.itempedidos =
        this.orderByIdFromDishes.itempedidos.filter(
          (elem) => elem.productoid !== idDish,
        );
    }
  }

  ngOnDestroy(): void {
    if (this.tableSubscription) this.tableSubscription.unsubscribe();
    if (this.orderSubscription) this.orderSubscription.unsubscribe();
  }
}
