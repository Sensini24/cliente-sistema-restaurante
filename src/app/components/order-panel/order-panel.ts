import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TableGetDTO } from '../../interfaces/ITable';
import { ItemCreateDTO, OrderDetailDTO } from '../../interfaces/IItem';
import { OrderCreateDTO } from '../../interfaces/IOrder';
import { Router } from '@angular/router';
import { TablesService } from '../../services/tables-service';
import { OrdersService } from '../../services/orders-service';

@Component({
  selector: 'app-order-panel',
  imports: [],
  templateUrl: './order-panel.html',
  styleUrl: './order-panel.css',
})
export class OrderPanelComponent implements OnInit, OnChanges {
  @Input() fromTable: TableGetDTO | null = null;
  @Input() countMap: Map<number, [number, string, number]> = new Map();

  tableNumber: number = 0;
  tableId: number = 0;
  nota: string = '';
  countItems: number[] = [];
  totalPrice: number = 0;
  itemsToOrder: OrderDetailDTO[] = [];
  itempedidosDTO: ItemCreateDTO[] = [];

  constructor(
    private router: Router,
    private _tableService: TablesService,
    private _orderService: OrdersService,
  ) {}

  ngOnInit(): void {
    if (this.fromTable) {
      this.tableNumber = this.fromTable?.numero;
      this.tableId = this.fromTable?.id;
      console.log('Mesa recibida desde dish componente: ', this.fromTable);
    }
    console.log(
      'Map con platos recibido desde dish componente: ',
      this.countMap,
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.itemsToOrder = [];
    this.itempedidosDTO = [];
    if (changes['fromTable']) {
      console.log('Mesa cambiada: ', changes['fromTable'].currentValue);
    }
    this.totalPrice = 0;

    if (changes['countMap']) {
      this.countMap.forEach((values, keys) => {
        // console.log('Datos de map: ', values, keys);
        const cantidad = values[0];
        const nombre = values[1];
        const subTotal = cantidad * values[2];
        this.nota = 'perro';

        // Objetos para detalles de pedido
        const nuevoObjeto: OrderDetailDTO = {
          id: keys,
          cantidad: cantidad,
          nombre: nombre,
          subTotal: subTotal,
          nota: this.nota,
        };

        // Items de pedidos de dto para creación de pedidos.
        const itemspedidos: ItemCreateDTO = {
          productoid: keys,
          cantidad: cantidad,
          notas: '',
        };

        //Ingreso de los objetos a los arrays
        this.itemsToOrder.push(nuevoObjeto);
        this.itempedidosDTO.push(itemspedidos);

        //Suma de subtotales de los items para muestra del total en interfaz
        this.totalPrice += subTotal;
      });
      console.log('Array sobre map de dishes: ', this.itemsToOrder);
    }
  }

  MakesOrder() {
    const orderDTO: OrderCreateDTO = {
      usuarioid: 1,
      mesaid: this.tableId,
      itempedidos: this.itempedidosDTO,
    };
    console.log('Pedido para guardar: ', orderDTO);

    this._orderService.CreatesOrder(orderDTO).subscribe((any) => {
      console.log('Pedido guardado correctamente: ', any);
    });
  }

  CancelOrder() {
    this._tableService.clearTableById();
    this.router.navigate(['/tables']);
  }
}
