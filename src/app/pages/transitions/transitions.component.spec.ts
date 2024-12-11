import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionsComponent } from './transitions.component';

describe('TransitionsComponent', () => {
  let component: TransitionsComponent;
  let fixture: ComponentFixture<TransitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransitionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
