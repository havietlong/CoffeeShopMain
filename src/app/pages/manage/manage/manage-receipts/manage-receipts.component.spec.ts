import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReceiptsComponent } from './manage-receipts.component';

describe('ManageReceiptsComponent', () => {
  let component: ManageReceiptsComponent;
  let fixture: ComponentFixture<ManageReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageReceiptsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
