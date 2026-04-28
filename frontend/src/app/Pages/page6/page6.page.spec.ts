import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Page6Page } from './page6.page';

describe('Page6Page', () => {
  let component: Page6Page;
  let fixture: ComponentFixture<Page6Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Page6Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
