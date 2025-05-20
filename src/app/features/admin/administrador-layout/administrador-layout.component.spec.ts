import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorLayoutComponent } from './administrador-layout.component';

describe('AdministradorLayoutComponent', () => {
  let component: AdministradorLayoutComponent;
  let fixture: ComponentFixture<AdministradorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministradorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
