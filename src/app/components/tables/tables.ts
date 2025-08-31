import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TableGetDTO } from '../../interfaces/ITable';
import { TablesService } from '../../services/tables-service';
import { Router } from '@angular/router';
import { log } from 'node:console';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './tables.html',
  styleUrl: './tables.css',
})
export class TablesComponent implements OnInit, OnDestroy {
  // INFO: Variables
  tables$!: Observable<TableGetDTO[] | null>;

  // Variable para cambio de estado y muestra de modal
  isActiveTableCleaning: boolean = false;
  stateFreeTable: boolean = false;
  stateOccupiedTable: boolean = false;
  stateCleaningTable: boolean = false;
  showModal: boolean = true;
  confirmation: boolean = false;

  //Recepcion de mesa al clicar en una mesa para ver sus opciones
  table: TableGetDTO = { id: 0, numero: 0, estado: '' };

  //Suscribciones
  private tableByIdSubscription: Subscription | undefined;

  constructor(
    // private cdr: ChangeDetectorRef,
    private _tableService: TablesService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    // this.getTableSubscription = this._tableService.tables$.subscribe(tables => {
    //   if (tables) {
    //     this.tables = tables;
    //     this.cdr.markForCheck();
    //     console.log("MESAS OBTENIDOS: ", tables);
    //   }
    // })
    this.tables$ = this._tableService.tables$;
  }

  //WARNING: Este método se puede factorizar y reducir.
  showMesaOptions(table: TableGetDTO) {
    if (table.estado == 'Libre') {
      this.showModal = true;
      this.stateFreeTable = true;
      this.stateCleaningTable = false;
      this.stateOccupiedTable = false;
    } else if (table.estado == 'Ocupada') {
      this.showModal = true;
      this.stateOccupiedTable = true;
      this.stateFreeTable = false;
      this.stateCleaningTable = false;
    } else if (table.estado == 'En Limpieza') {
      this.showModal = true;
      this.stateCleaningTable = true;
      this.stateFreeTable = false;
      this.stateOccupiedTable = false;
    }
    console.log('Estado mesa: ', table.estado);
    this.table = table;
  }

  closeModalOptions() {
    this.showModal = false;
  }

  changeToFreeStateTable(): void {
    this._tableService.ChangeStateTable(this.table.id).subscribe(() => {
      this.showModal = false;
      this._tableService.GetTables();
    });
    console.log('Mesa actual: ', this.table.numero);
  }

  //INFO: Se pasa la informacion de la mesa obtenida
  SendInfoTableToMakesOrder(): void {
    // console.log('Se recibio datos de la mesa correctamente: ', this.table);
    this.tableByIdSubscription = this._tableService
      .GetTableById(this.table.id)
      .subscribe((apidata) => {
        console.log('Se recibio los datos de table al suscribirse: ', apidata);
        this.router.navigate(['/dishes']);
      });
  }

  ngOnDestroy(): void {
    if (this.tableByIdSubscription) this.tableByIdSubscription.unsubscribe();
  }
}
