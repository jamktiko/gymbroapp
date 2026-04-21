import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameScreenPage } from './game-screen.page';

describe('GameScreenPage', () => {
  let component: GameScreenPage;
  let fixture: ComponentFixture<GameScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GameScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
