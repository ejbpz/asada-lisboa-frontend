import { of } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchForm } from './search-form';
import { SearchApi } from '@core/services/search-api';

describe('SearchForm', () => {
  let component: SearchForm;
  let fixture: ComponentFixture<SearchForm>;
  let searchApiSpy: jasmine.SpyObj<SearchApi>;

  beforeEach(async () => {
    searchApiSpy = jasmine.createSpyObj('SearchApi', [
      'searchPublicData',
    ]);

    searchApiSpy.searchPublicData.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [SearchForm],
      providers: [
        {
          provide: SearchApi,
          useValue: searchApiSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchForm);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty query', () => {
    const queryControl = component['searchForm'].get('query');

    expect(queryControl?.value).toBe('');
  });

  it('should mark form as invalid when query is empty', () => {
    const form = component['searchForm'];

    form.patchValue({
      query: '',
    });

    expect(form.invalid).toBeTrue();
  });

  it('should mark form as invalid when query length is less than 2', () => {
    const form = component['searchForm'];

    form.patchValue({
      query: 'a',
    });

    expect(form.invalid).toBeTrue();
  });

  it('should mark form as valid when query length is valid', () => {
    const form = component['searchForm'];

    form.patchValue({
      query: 'agua',
    });

    expect(form.valid).toBeTrue();
  });

  it('should mark controls as touched when form is invalid', () => {
    const event = new Event('input');

    component['searchForm'].patchValue({
      query: '',
    });

    component['onSearch'](event);

    expect(component['searchForm'].touched).toBeTrue();
  });

  it('should update query signal after 300ms when form is valid', fakeAsync(() => {
    const input = document.createElement('input');
    input.value = 'reciclaje';

    const event = {
      target: input,
    } as unknown as Event;

    component['searchForm'].patchValue({
      query: 'reciclaje',
    });

    component['onSearch'](event);

    tick(299);

    expect(component['query']()).toBe('');

    tick(1);

    expect(component['query']()).toBe('reciclaje');
  }));

  it('should call search api when query changes', fakeAsync(() => {
    const input = document.createElement('input');
    input.value = 'agua';

    const event = {
      target: input,
    } as unknown as Event;

    component['searchForm'].patchValue({
      query: 'agua',
    });

    component['onSearch'](event);

    tick(300);

    fixture.detectChanges();

    expect(searchApiSpy.searchPublicData).toHaveBeenCalledWith(
      'agua'
    );
  }));

  it('should return validation error message', () => {
    const errors = {
      required: true,
    };

    const result = component['getErrors'](errors);

    expect(result).toBeTruthy();
  });
});
