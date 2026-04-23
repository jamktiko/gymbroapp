import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Page4Page } from './page4.page';

describe('Page4Page', () => {
  let component: Page4Page;
  let fixture: ComponentFixture<Page4Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Page4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});