import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchPageComponent } from './advanced-search.page.component';

describe('AdvancedSearchPageComponent', () => {
  let component: AdvancedSearchPageComponent;
  let fixture: ComponentFixture<AdvancedSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedSearchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
