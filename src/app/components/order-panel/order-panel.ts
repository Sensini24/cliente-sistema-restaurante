import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TableGetDTO } from '../../interfaces/ITable';
import { map } from 'rxjs';
import { OrderDetailDTO } from '../../interfaces/IItem';

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
  countItems: number[] = [];
  itemsToOrder: OrderDetailDTO[] = [];
  constructor() {}

  ngOnInit(): void {
    if (this.fromTable) {
      this.tableNumber = this.fromTable?.numero;
      console.log('Mesa recibida desde dish componente: ', this.fromTable);
    }
    console.log(
      'Map con platos recibido desde dish componente: ',
      this.countMap,
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.itemsToOrder = [];
    if (changes['fromTable']) {
      console.log('Mesa cambiada: ', changes['fromTable'].currentValue);
    }
    if (changes['countMap']) {
      this.countMap.forEach((values, keys) => {
        // console.log('Datos de map: ', values, keys);
        const cantidad = values[0];
        const nombre = values[1];
        const subTotal = cantidad * values[2];
        const nuevoObjeto: OrderDetailDTO = {
          id: keys,
          cantidad: cantidad,
          nombre: nombre,
          subTotal: subTotal,
        };
        this.itemsToOrder.push(nuevoObjeto);
      });
      console.log('Array sobre map de dishes: ', this.itemsToOrder);
    }
  }
}
