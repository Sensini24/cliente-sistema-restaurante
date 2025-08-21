import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersWaiterComponent } from './orders-waiter';


describe('OrdersAll', () => {
  let component: OrdersWaiterComponent;
  let fixture: ComponentFixture<OrdersWaiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersWaiterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrdersWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
