import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmsComponent } from './algorithms.component';

describe('AlgorithmsComponent', () => {
  let component: AlgorithmsComponent;
  let fixture: ComponentFixture<AlgorithmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlgorithmsComponent]
    });
    fixture = TestBed.createComponent(AlgorithmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
