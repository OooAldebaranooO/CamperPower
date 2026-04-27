import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolarPage } from './solar.page';

describe('SolarPage', () => {
  let component: SolarPage;
  let fixture: ComponentFixture<SolarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
