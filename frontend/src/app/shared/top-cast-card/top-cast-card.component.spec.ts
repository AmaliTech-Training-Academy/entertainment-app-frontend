import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCastCardComponent } from './top-cast-card.component';

describe('TopCastCardComponent', () => {
  let component: TopCastCardComponent;
  let fixture: ComponentFixture<TopCastCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopCastCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopCastCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
