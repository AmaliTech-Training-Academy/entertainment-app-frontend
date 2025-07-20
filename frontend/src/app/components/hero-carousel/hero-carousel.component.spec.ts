import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeroCarouselComponent } from './hero-carousel.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

describe('HeroCarouselComponent', () => {
  let component: HeroCarouselComponent;
  let fixture: ComponentFixture<HeroCarouselComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeroCarouselComponent, ButtonComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroCarouselComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentIndex).toBe(0);
    expect(component.animate).toBe(true);
    expect(component.heroItems.length).toBe(5);
  });

  it('should return current hero based on currentIndex', () => {
    const expectedHero = component.heroItems[0];
    expect(component.currentHero).toEqual(expectedHero);
  });

  it('should update currentHero when currentIndex changes', () => {
    component.currentIndex = 1;
    const expectedHero = component.heroItems[1];
    expect(component.currentHero).toEqual(expectedHero);
  });

  describe('Navigation Methods', () => {
    it('should navigate to next slide', () => {
      const initialIndex = component.currentIndex;
      component.nextSlide();
      expect(component.currentIndex).toBe((initialIndex + 1) % component.heroItems.length);
    });

    it('should wrap to first slide when reaching end', () => {
      component.currentIndex = component.heroItems.length - 1;
      component.nextSlide();
      expect(component.currentIndex).toBe(0);
    });

    it('should go to specific slide', () => {
      const targetIndex = 2;
      component.goToSlide(targetIndex);
      expect(component.currentIndex).toBe(targetIndex);
    });

    it('should handle invalid slide index gracefully', () => {
      const initialIndex = component.currentIndex;
      component.goToSlide(-1);
      expect(component.currentIndex).toBe(-1);
    });
  });

  describe('Animation', () => {
    it('should trigger animation correctly', fakeAsync(() => {
      component.animate = true;
      component.triggerAnimation();
      expect(component.animate).toBe(false);
      
      tick(10);
      expect(component.animate).toBe(true);
    }));
  });

  describe('User Actions', () => {
    it('should navigate to media player when playNow is called', () => {
      component.playNow();
      expect(router.navigate).toHaveBeenCalledWith(['/media/9/player']);
    });

    it('should navigate to detail page when showInfo is called', () => {
      component.showInfo();
      expect(router.navigate).toHaveBeenCalledWith(['media/detail/9']);
    });
  });

  describe('Lifecycle Methods', () => {
    it('should start auto-slide interval on init', fakeAsync(() => {
      const initialIndex = component.currentIndex;
      component.ngOnInit();
      
      tick(5000);
      expect(component.currentIndex).toBe((initialIndex + 1) % component.heroItems.length);
    }));

    it('should clear interval on destroy', () => {
      component.ngOnInit();
      const clearIntervalSpy = spyOn(window, 'clearInterval');
      
      component.ngOnDestroy();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should display current hero title', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain(component.currentHero.title);
    });

    it('should display current hero description', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain(component.currentHero.description);
    });

    it('should display current hero rating', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain(component.currentHero.rating.toString());
    });

    it('should display current hero year', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain(component.currentHero.year.toString());
    });

    it('should display current hero duration', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain(component.currentHero.duration);
    });

    it('should display current hero genres', () => {
      const compiled = fixture.nativeElement;
      component.currentHero.genres.forEach(genre => {
        expect(compiled.textContent).toContain(genre);
      });
    });

    it('should render correct number of indicators', () => {
      const compiled = fixture.nativeElement;
      const indicators = compiled.querySelectorAll('.hero-carousel-indicators span');
      expect(indicators.length).toBe(component.heroItems.length);
    });

    it('should apply active class to current indicator', () => {
      const compiled = fixture.nativeElement;
      const indicators = compiled.querySelectorAll('.hero-carousel-indicators span');
      expect(indicators[component.currentIndex]).toHaveClass('active');
    });

    it('should apply slide-animation class when animate is true', () => {
      component.animate = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const heroContent = compiled.querySelector('.hero-content');
      expect(heroContent).toHaveClass('slide-animation');
    });

    it('should not apply slide-animation class when animate is false', () => {
      component.animate = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const heroContent = compiled.querySelector('.hero-content');
      expect(heroContent).not.toHaveClass('slide-animation');
    });
  });

  describe('Indicator Click Handling', () => {
    it('should call goToSlide when indicator is clicked', () => {
      const goToSlideSpy = spyOn(component, 'goToSlide');
      const compiled = fixture.nativeElement;
      const indicators = compiled.querySelectorAll('.hero-carousel-indicators span');
      
      indicators[2].click();
      expect(goToSlideSpy).toHaveBeenCalledWith(2);
    });
  });

  describe('Button Click Handling', () => {
    it('should call playNow when Play Now button is clicked', () => {
      const playNowSpy = spyOn(component, 'playNow');
      const compiled = fixture.nativeElement;
      const playButton = compiled.querySelector('app-button[ariaLabel="Play Now"]');
      
      playButton.click();
      expect(playNowSpy).toHaveBeenCalled();
    });

    it('should call showInfo when Info button is clicked', () => {
      const showInfoSpy = spyOn(component, 'showInfo');
      const compiled = fixture.nativeElement;
      const infoButton = compiled.querySelector('app-button[ariaLabel="Info"]');
      
      infoButton.click();
      expect(showInfoSpy).toHaveBeenCalled();
    });
  });
});
