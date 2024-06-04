import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniorderComponent } from './miniorder.component';

describe('MiniorderComponent', () => {
  let component: MiniorderComponent;
  let fixture: ComponentFixture<MiniorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniorderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiniorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
