import { ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { SearchBar } from './search-bar';
import { SortDirection } from '@shared/enums/sort-direction.enum';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  const emitSpy = jasmine.createSpy('emitSearch');

  const stateMock = {
    search: '',
    sortBy: '',
    filterBy: '',
    sortDirection: SortDirection.ASC
  };

  const sortByMock = [
    { value: 'name', name: 'Name' }
  ];

  const filterByMock = [
    { value: 'category', name: 'Category' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;

    component.emitSearch = { emit: emitSpy } as any;

    fixture.componentRef.setInput('stateValue', stateMock);
    fixture.componentRef.setInput('sortBy', sortByMock);
    fixture.componentRef.setInput('filterBy', filterByMock);

    fixture.detectChanges();
  });

  afterEach(() => {
    emitSpy.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with stateValue', () => {
    component.ngOnInit();

    expect(component['searchForm'].value).toEqual({
      search: '',
      sortBy: '',
      filterBy: '',
      sortDirection: SortDirection.ASC
    });
  });

  it('should toggle sort direction ASC → DESC', () => {
    component.ngOnInit();

    component.toggleSort();

    expect(component['searchForm'].value.sortDirection).toBe(SortDirection.DESC);
  });

  it('should toggle sort direction DESC → ASC', () => {
    fixture.componentRef.setInput('stateValue', {
      ...stateMock,
      sortDirection: SortDirection.DESC
    });

    component.ngOnInit();

    component.toggleSort();

    expect(component['searchForm'].value.sortDirection).toBe(SortDirection.ASC);
  });

  it('should emit when search changes', fakeAsync(() => {
    component.ngOnInit();

    component['searchForm'].patchValue({ search: 'water' });

    tick(400);
    flushMicrotasks();

    expect(emitSpy).toHaveBeenCalled();
  }));

  it('should emit when filterBy changes AND search exists', fakeAsync(() => {
    component.ngOnInit();

    component['searchForm'].patchValue({
      search: 'water',
      filterBy: 'category'
    });

    tick(400);
    flushMicrotasks();

    expect(emitSpy).toHaveBeenCalled();
  }));

  it('should not emit when filterBy changes without search', fakeAsync(() => {
    component.ngOnInit();

    tick(400);
    flushMicrotasks();

    emitSpy.calls.reset();

    component['searchForm'].patchValue({
      search: '',
      sortBy: '',
      filterBy: 'category',
      sortDirection: SortDirection.ASC
    });

    tick(400);
    flushMicrotasks();

    expect(emitSpy).not.toHaveBeenCalled();
  }));

  it('should not emit on identical value changes', fakeAsync(() => {
    component.ngOnInit();

    tick(400);
    flushMicrotasks();

    emitSpy.calls.reset();

    component['searchForm'].patchValue(stateMock);

    tick(400);
    flushMicrotasks();

    expect(emitSpy).not.toHaveBeenCalled();
  }));
});
