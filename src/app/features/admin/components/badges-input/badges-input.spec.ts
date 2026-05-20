import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { BadgesInput } from './badges-input';
import { CategoriesApi } from '@core/services/categories-api';
import { CategoriesResponse } from '@shared/interfaces/categories-response.interface';

describe('BadgesInput', () => {
  let component: BadgesInput;
  let fixture: ComponentFixture<BadgesInput>;

  let categoriesApi: jasmine.SpyObj<CategoriesApi>;

  const mockCategories: CategoriesResponse[] = [
    {
      id: '1',
      name: 'mantenimiento'
    },
    {
      id: '2',
      name: 'administracion'
    }
  ];

  beforeEach(async () => {
    categoriesApi = jasmine.createSpyObj<CategoriesApi>(
      'CategoriesApi',
      ['searchCategories']
    );

    categoriesApi.searchCategories
      .and
      .returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [BadgesInput],
      providers: [
        {
          provide: CategoriesApi,
          useValue: categoriesApi
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BadgesInput);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should write value correctly', () => {
      component.writeValue(mockCategories);

      expect(component['badges']())
        .toEqual(mockCategories);
    });

    it('should write empty array when value is undefined', () => {
      component.writeValue(undefined);

      expect(component['badges']())
        .toEqual([]);
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy();

      component.registerOnChange(fn);

      component['onChange'](mockCategories);

      expect(fn)
        .toHaveBeenCalledWith(mockCategories);
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy();

      component.registerOnTouched(fn);

      component['onTouched']();

      expect(fn)
        .toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState?.(true);

      expect(component['disabled'])
        .toBeTrue();
    });
  });

  describe('Input handling', () => {
    it('should update input value on input event', () => {
      const event = {
        target: {
          value: 'mantenimiento'
        }
      } as unknown as Event;

      component['onInput'](event);

      expect(component['inputValue']())
        .toBe('mantenimiento');
    });

    it('should not update input value when disabled', () => {
      component.setDisabledState?.(true);

      const event = {
        target: {
          value: 'mantenimiento'
        }
      } as unknown as Event;

      component['onInput'](event);

      expect(component['inputValue']())
        .toBe('');
    });
  });

  describe('Keyboard handling', () => {
    it('should add badge on Enter key', () => {
      const onChange = jasmine.createSpy();

      component.registerOnChange(onChange);

      component['inputValue'].set('mantenimiento');

      const preventDefault = jasmine.createSpy();

      const event = {
        key: 'Enter',
        preventDefault
      } as unknown as KeyboardEvent;

      component['onKeyDown'](event);

      expect(preventDefault)
        .toHaveBeenCalled();

      expect(component['badges']().length)
        .toBe(1);

      expect(component['badges']()[0].name)
        .toBe('mantenimiento');

      expect(component['inputValue']())
        .toBe('');

      expect(onChange)
        .toHaveBeenCalled();
    });

    it('should add badges on comma key', () => {
      const onChange = jasmine.createSpy();

      component.registerOnChange(onChange);

      component['inputValue']
        .set('mantenimiento, administracion');

      const preventDefault = jasmine.createSpy();

      const event = {
        key: ',',
        code: 'Comma',
        preventDefault
      } as unknown as KeyboardEvent;

      component['onKeyDown'](event);

      expect(component['badges']().length)
        .toBe(2);

      expect(component['badges']()[0].name)
        .toBe('mantenimiento');

      expect(component['badges']()[1].name)
        .toBe('administracion');

      expect(onChange)
        .toHaveBeenCalled();
    });

    it('should not add empty badge on Enter', () => {
      component['inputValue'].set('   ');

      const event = {
        key: 'Enter',
        preventDefault: jasmine.createSpy()
      } as unknown as KeyboardEvent;

      component['onKeyDown'](event);

      expect(component['badges']().length)
        .toBe(0);
    });

    it('should not add duplicate badges', () => {
      component.writeValue([
        {
          id: '1',
          name: 'mantenimiento'
        }
      ]);

      component['inputValue'].set('mantenimiento');

      const event = {
        key: 'Enter',
        preventDefault: jasmine.createSpy()
      } as unknown as KeyboardEvent;

      component['onKeyDown'](event);

      expect(component['badges']().length)
        .toBe(1);
    });

    it('should not execute keyboard actions when disabled', () => {
      component.setDisabledState?.(true);

      component['inputValue'].set('mantenimiento');

      const event = {
        key: 'Enter',
        preventDefault: jasmine.createSpy()
      } as unknown as KeyboardEvent;

      component['onKeyDown'](event);

      expect(component['badges']().length)
        .toBe(0);
    });
  });

  describe('Suggestions', () => {
    it('should not search if query length is less than 2', fakeAsync(() => {
      component['inputValue'].set('m');

      tick(300);

      expect(categoriesApi.searchCategories)
        .not
        .toHaveBeenCalled();
    }));

    it('should filter already selected suggestions', () => {
      component.writeValue([
        {
          id: '1',
          name: 'mantenimiento'
        }
      ]);

      component['categoriesSearchResource'] = {
        value: signal(mockCategories)
      } as any;

      const result = component['filteredSuggestions']();

      expect(result.length)
        .toBe(1);

      expect(result[0].name)
        .toBe('administracion');
    });

    it('should select suggestion', () => {
      const onChange = jasmine.createSpy();

      component.registerOnChange(onChange);

      component['selectSuggestion']({
        id: '1',
        name: 'mantenimiento'
      });

      expect(component['badges']().length)
        .toBe(1);

      expect(component['badges']()[0].name)
        .toBe('mantenimiento');

      expect(component['inputValue']())
        .toBe('');

      expect(onChange)
        .toHaveBeenCalled();
    });

    it('should not select suggestion when disabled', () => {
      component.setDisabledState?.(true);

      component['selectSuggestion']({
        id: '1',
        name: 'mantenimiento'
      });

      expect(component['badges']().length)
        .toBe(0);
    });
  });

  describe('Remove badge', () => {
    beforeEach(() => {
      component.writeValue(mockCategories);
    });

    it('should remove badge', () => {
      const onChange = jasmine.createSpy();

      component.registerOnChange(onChange);

      component['removeBadge'](0);

      expect(component['badges']().length)
        .toBe(1);

      expect(component['badges']()[0].name)
        .toBe('administracion');

      expect(onChange)
        .toHaveBeenCalled();
    });

    it('should not remove badge when disabled', () => {
      component.setDisabledState?.(true);

      component['removeBadge'](0);

      expect(component['badges']().length)
        .toBe(2);
    });
  });

  describe('Template rendering', () => {
    beforeEach(() => {
      component.writeValue(mockCategories);

      fixture.detectChanges();
    });

    it('should render badges', () => {
      const badges = fixture.debugElement.queryAll(
        By.css('.badge')
      );

      expect(badges.length)
        .toBe(2);
    });

    it('should render badge names in lowercase', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('mantenimiento');

      expect(compiled.textContent)
        .toContain('administracion');
    });

    it('should call removeBadge on remove button click', () => {
      spyOn(component as any, 'removeBadge');

      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(
        By.css('.badge button')
      );

      buttons[0].nativeElement.click();

      expect(component['removeBadge'])
        .toHaveBeenCalledWith(0);
    });
  });
});
