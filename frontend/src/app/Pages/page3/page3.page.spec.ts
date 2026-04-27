import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Page3Page } from './page3.page';

describe('Page3Page', () => {
  let component: Page3Page;
  let fixture: ComponentFixture<Page3Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Page3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
