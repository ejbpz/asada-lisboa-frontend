import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DirectorsList } from './directors-list';
import { DirectorsBoardApi } from '@core/services/directors-board-api';

describe('DirectorsList', () => {
  let component: DirectorsList;
  let fixture: ComponentFixture<DirectorsList>;
  let api: jasmine.SpyObj<DirectorsBoardApi>;

  const mockUsers = [
    { id: '1', name: 'juan perez', charge: 'gerente' },
    { id: '2', name: 'ana lopez', charge: 'secretaria' }
  ] as any;

  beforeEach(async () => {
    api = jasmine.createSpyObj('DirectorsBoardApi', [
      'getDirectorsBoardInformation'
    ]);

    await TestBed.configureTestingModule({
      imports: [DirectorsList],
      providers: [
        { provide: DirectorsBoardApi, useValue: api },
        TitleCasePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorsList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call API on AfterViewInit', fakeAsync(() => {
    api.getDirectorsBoardInformation.and.returnValue(of(mockUsers));

    fixture.detectChanges(); // execute ngAfterViewInit
    tick();

    expect(api.getDirectorsBoardInformation).toHaveBeenCalled();
  }));

  it('should set users after API response', fakeAsync(() => {
    api.getDirectorsBoardInformation.and.returnValue(of(mockUsers));

    fixture.detectChanges();
    tick();

    expect(component['users']()).toEqual(mockUsers);
  }));

  it('should set loading states correctly', fakeAsync(() => {
    api.getDirectorsBoardInformation.and.returnValue(of(mockUsers));

    fixture.detectChanges();

    expect(component['isLoading']()).toBeFalse();
  }));

  it('should not call API if already loading', () => {
    component['isLoading'].set(true);

    component.usersApiService();

    expect(api.getDirectorsBoardInformation).not.toHaveBeenCalled();
  });

  it('should handle API error and reset loading', fakeAsync(() => {
    api.getDirectorsBoardInformation.and.returnValue(
      throwError(() => new Error('fail'))
    );

    fixture.detectChanges();
    tick();

    expect(component['isLoading']()).toBeFalse();
    expect(component['users']()).toBeNull();
  }));

  it('should render table rows when data exists', fakeAsync(() => {
    api.getDirectorsBoardInformation.and.returnValue(of(mockUsers));

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');

    expect(rows.length).toBe(2);
  }));
});
