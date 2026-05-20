import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminUsersList } from './admin-users-list';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { DirectorsBoardApi } from '@core/services/directors-board-api';
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';

describe('AdminUsersList', () => {
  let component: AdminUsersList;
  let fixture: ComponentFixture<AdminUsersList>;

  let toastMessage: jasmine.SpyObj<ToastMessage>;
  let directorsBoardApi: jasmine.SpyObj<DirectorsBoardApi>;

  const mockUsers: DirectorsBoardResponse[] = [
    {
      id: 'user-1',
      name: 'eduardo brenes',
      charge: 'presidente'
    } as DirectorsBoardResponse,
    {
      id: 'user-2',
      name: 'raul ramirez',
      charge: 'secretario'
    } as DirectorsBoardResponse
  ];

  beforeEach(async () => {
    toastMessage = jasmine.createSpyObj<ToastMessage>(
      'ToastMessage',
      ['success', 'error']
    );

    directorsBoardApi = jasmine.createSpyObj<DirectorsBoardApi>(
      'DirectorsBoardApi',
      ['deleteUser']
    );

    await TestBed.configureTestingModule({
      imports: [
        AdminUsersList,
      ],
      providers: [
        provideRouter([]),
        {
          provide: ToastMessage,
          useValue: toastMessage
        },
        {
          provide: DirectorsBoardApi,
          useValue: directorsBoardApi
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('users', mockUsers);

    fixture.detectChanges();

    const modal = document.createElement('dialog');

    spyOn(modal, 'showModal');
    spyOn(modal, 'close');

    component['modal'] = signal({
      nativeElement: modal
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set users data from input', () => {
      expect(component['usersData']()).toEqual(mockUsers);
    });
  });

  describe('Delete modal', () => {
    it('should open delete modal and set selected id', () => {
      component.onDeleteUser('user-1');

      expect(component['selectedId']()).toBe('user-1');

      expect(component['modal']().nativeElement.showModal)
        .toHaveBeenCalled();
    });

    it('should close delete modal and clear selected id', () => {
      component['selectedId'].set('user-1');

      component['closeDeleteModal']();

      expect(component['selectedId']()).toBeNull();

      expect(component['modal']().nativeElement.close)
        .toHaveBeenCalled();
    });

    it('should not call api when selected id is null', () => {
      component['selectedId'].set(null);

      component['confirmDelete']();

      expect(directorsBoardApi.deleteUser)
        .not
        .toHaveBeenCalled();
    });

    it('should call user api service when confirm delete', () => {
      directorsBoardApi.deleteUser
        .and
        .returnValue(of(void 0));

      component['selectedId'].set('user-1');

      component['confirmDelete']();

      expect(directorsBoardApi.deleteUser)
        .toHaveBeenCalledWith('user-1');
    });
  });

  describe('Delete user service', () => {
    it('should delete user successfully', () => {
      directorsBoardApi.deleteUser
        .and
        .returnValue(of(void 0));

      component['selectedId'].set('user-1');

      component['confirmDelete']();

      expect(directorsBoardApi.deleteUser)
        .toHaveBeenCalledWith('user-1');

      expect(toastMessage.success)
        .toHaveBeenCalledWith('Usuario eliminado con éxito.');

      expect(component['usersData']().length)
        .toBe(1);

      expect(component['usersData']()[0].id)
        .toBe('user-2');

      expect(component['selectedId']())
        .toBeNull();

      expect(component['isLoading']())
        .toBeFalse();
    });

    it('should handle delete user error', () => {
      const error: AppError = {
        message: 'Error deleting user'
      };

      directorsBoardApi.deleteUser
        .and
        .returnValue(
          throwError(() => error)
        );

      component['selectedId'].set('user-1');

      component['confirmDelete']();

      expect(toastMessage.error)
        .toHaveBeenCalledWith('Error deleting user');

      expect(component['isLoading']())
        .toBeFalse();
    });

    it('should not call api if already loading', () => {
      component['isLoading'].set(true);

      component['userApiService']('user-1');

      expect(directorsBoardApi.deleteUser)
        .not
        .toHaveBeenCalled();
    });

    it('should remove deleted user from list', () => {
      component['removeUserFromList']('user-1');

      expect(component['usersData']().length)
        .toBe(1);

      expect(component['usersData']()[0].id)
        .toBe('user-2');
    });
  });

  describe('Template rendering', () => {
    it('should render users in table', () => {
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );

      expect(rows.length).toBe(2);
    });

    it('should render user names and charges', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Eduardo Brenes');

      expect(compiled.textContent)
        .toContain('Presidente');

      expect(compiled.textContent)
        .toContain('Raul Ramirez');

      expect(compiled.textContent)
        .toContain('Secretario');
    });

    it('should call onDeleteUser when delete button is clicked', () => {
      spyOn(component, 'onDeleteUser');

      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(
        By.css('button')
      );

      const deleteButton = buttons.find(button =>
        button.nativeElement.textContent.includes('Eliminar')
      );

      deleteButton?.nativeElement.click();

      expect(component.onDeleteUser)
        .toHaveBeenCalledWith('user-1');
    });
  });
});
