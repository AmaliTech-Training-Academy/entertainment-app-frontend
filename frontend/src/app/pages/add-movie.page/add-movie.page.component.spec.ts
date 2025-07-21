import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoviePageComponent } from './add-movie.page.component';

describe('AddMoviePageComponent', () => {
  let component: AddMoviePageComponent;
  let fixture: ComponentFixture<AddMoviePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMoviePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMoviePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
