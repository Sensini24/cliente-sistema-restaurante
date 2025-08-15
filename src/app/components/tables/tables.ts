import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables-service';
import { TableGetDTO } from '../../interfaces/ITable';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './tables.html',
  styleUrl: './tables.css'
})
export class TablesComponent implements OnInit {

  // INFO: Variables
  tables$!: Observable<TableGetDTO[] | null>;

  constructor(
    // private cdr: ChangeDetectorRef,
    private _tableService: TablesService) { }

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


  // getIdTable() {
  //   console.log()
  // }
}
