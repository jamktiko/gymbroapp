import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Page5Page } from './page5.page';

describe('Page5Page', () => {
  let component: Page5Page;
  let fixture: ComponentFixture<Page5Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Page5Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
