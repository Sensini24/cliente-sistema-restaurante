import { Routes } from '@angular/router';
import { TablesComponent } from './components/tables/tables';
import { PaysComponent } from './components/pays/pays';
import { NotificationsComponent } from './components/notifications/notifications';
import { OrdersComponent } from './components/orders/orders';
import { NewOrderComponent } from './components/new-order/new-order';
import { DishesComponent } from './components/dishes/dishes';

export const routes: Routes = [
  { path: "", redirectTo: "dishes", pathMatch: "full" },
  { path: "dishes", component: DishesComponent, pathMatch: "full" },
  { path: "tables", component: TablesComponent, pathMatch: "full" },
  { path: "pays", component: PaysComponent, pathMatch: "full" },
  { path: "orders", component: OrdersComponent, pathMatch: "full" },
  { path: "newOrder", component: NewOrderComponent, pathMatch: "full" },
  { path: "notifications", component: NotificationsComponent, pathMatch: "full" },
];
