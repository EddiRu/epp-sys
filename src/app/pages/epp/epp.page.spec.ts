import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EppPage } from './epp.page';

describe('EppPage', () => {
  let component: EppPage;
  let fixture: ComponentFixture<EppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
