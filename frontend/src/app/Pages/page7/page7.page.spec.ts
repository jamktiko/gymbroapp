import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Page7Page } from './page7.page';

describe('Page7Page', () => {
  let component: Page7Page;
  let fixture: ComponentFixture<Page7Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Page7Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
