import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DealerPage } from './dealer.page';

describe('DealerPage', () => {
  let component: DealerPage;
  let fixture: ComponentFixture<DealerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
