import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestsComponent } from './admin-tests.component';

describe('AdminTestsComponent', () => {
  let component: AdminTestsComponent;
  let fixture: ComponentFixture<AdminTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
