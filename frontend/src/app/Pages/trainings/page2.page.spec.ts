import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Page2Page } from './page2.page';

describe('Page2Page', () => {
  let component: Page2Page;
  let fixture: ComponentFixture<Page2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Page2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
