import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MointorPageComponent } from './mointor-page.component';

describe('MointorPageComponent', () => {
  let component: MointorPageComponent;
  let fixture: ComponentFixture<MointorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MointorPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MointorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
