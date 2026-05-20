import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { AboutUsTimeline } from './about-us-timeline';
import { AboutUsApi } from '@core/services/about-us-api';
import { AboutUsResponse } from '@public/interfaces/about-us-response.interface';

describe('AboutUsTimeline', () => {
  let fixture: ComponentFixture<AboutUsTimeline>;
  let component: AboutUsTimeline;

  let aboutUsApi: jasmine.SpyObj<AboutUsApi>;

  const mockData: AboutUsResponse[] = [
    {
      id: '1',
      sectionType: 'Historia',
      content: 'Contenido historia',
      order: 1
    },
    {
      id: '2',
      sectionType: 'Misión',
      content: 'Contenido misión',
      order: 2
    }
  ] as AboutUsResponse[];

  beforeEach(async () => {
    aboutUsApi = jasmine.createSpyObj<AboutUsApi>(
      'AboutUsApi',
      ['getAboutUsInformation']
    );

    aboutUsApi.getAboutUsInformation
      .and
      .returnValue(of(mockData));

    await TestBed.configureTestingModule({
      imports: [AboutUsTimeline],
      providers: [
        {
          provide: AboutUsApi,
          useValue: aboutUsApi
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsTimeline);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Lifecycle', () => {
    it('should call API on ngAfterViewInit', () => {
      expect(aboutUsApi.getAboutUsInformation)
        .toHaveBeenCalled();
    });

    it('should set aboutUsData after response', fakeAsync(() => {
      tick();

      expect(component['aboutUsData']())
        .toEqual(mockData);
    }));

    it('should set loading state correctly', fakeAsync(() => {
      tick();

      expect(component['isLoading']()).toBeFalse();
    }));
  });

  describe('timelineSide()', () => {
    it('should return start class for index 0', () => {
      const result = component['timelineSide'](0);

      expect(result).toContain('timeline-start');
      expect(result).toContain('md:text-end');
    });

    it('should return end class for index 1', () => {
      const result = component['timelineSide'](1);

      expect(result).toContain('timeline-end');
      expect(result).toContain('md:text-start');
    });
  });

  describe('Template rendering', () => {
    it('should render timeline items', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(
        By.css('li')
      );

      expect(items.length).toBe(2);
    }));

    it('should render section titles', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Historia');

      expect(compiled.textContent)
        .toContain('Misión');
    }));
  });
});
