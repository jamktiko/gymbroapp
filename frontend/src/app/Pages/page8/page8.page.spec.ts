import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Page8Page } from './page8.page';

describe('Page8Page', () => {
  let component: Page8Page;
  let fixture: ComponentFixture<Page8Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Page8Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
