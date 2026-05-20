import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, input } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import AdminUpdateUserPage from './admin-update-user-page';
import { DirectorsBoardApi } from '@core/services/directors-board-api';
import { GetBackTitle } from '@shared/components/get-back-title/get-back-title';
import { AdminUpdateUserForm } from '@admin/components/admin-update-user-form/admin-update-user-form';
import { DirectorBoardDetailsResponse } from '@admin/interfaces/director-board-details-response.interface';

@Component({
  selector: 'admin-update-user-form',
  template: ''
})
class MockAdminUpdateUserForm {
  userToUpdate = input<DirectorBoardDetailsResponse | undefined>();
}

@Component({
  selector: 'get-back-title',
  template: '{{ title() }}'
})
class MockGetBackTitle {
  title = input.required<string>();
  link = input<string>();
  isAdmin = input<boolean>();
}

describe('AdminUpdateUserPage', () => {
  let component: AdminUpdateUserPage;
  let fixture: ComponentFixture<AdminUpdateUserPage>;

  let directorsBoardApi: jasmine.SpyObj<DirectorsBoardApi>;

  const mockUser: DirectorBoardDetailsResponse = {
    id: '1',
    email: 'juan@test.com',
    fullName: 'Juan Pérez',
    charge: 'Presidente',
    chargeId: '1',
    firstName: 'Eduardo',
    firstLastName: 'Brenes',
    secondLastName: 'Pérez',
    phoneNumber: '8888-8888',
    roles: [
      {
        id: '3',
        name: 'Administrador',
      }
    ],
  } as DirectorBoardDetailsResponse;

  beforeEach(async () => {
    directorsBoardApi = jasmine.createSpyObj<DirectorsBoardApi>(
      'DirectorsBoardApi',
      ['getAdminUser']
    );

    directorsBoardApi.getAdminUser
      .and
      .returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [AdminUpdateUserPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: DirectorsBoardApi,
          useValue: directorsBoardApi
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: 'user-1'
            })
          }
        }
      ]
    })
    .overrideComponent(AdminUpdateUserPage, {
      remove: {
        imports: [
          GetBackTitle,
          AdminUpdateUserForm
        ]
      },
      add: {
        imports: [
          MockGetBackTitle,
          MockAdminUpdateUserForm
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(
      AdminUpdateUserPage
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Route params', () => {
    it('should get id from route params', () => {
      expect(component['id']())
        .toBe('user-1');
    });
  });

  describe('User resource', () => {
    it('should call get admin user service', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      expect(directorsBoardApi.getAdminUser)
        .toHaveBeenCalledWith('user-1');
    }));

    it('should set user resource value', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      expect(component['userResource'].value())
        .toEqual(mockUser);
    }));
  });

  describe('Template rendering', () => {
    it('should render page title', () => {
      const title = fixture.debugElement.query(
        By.directive(MockGetBackTitle)
      );

      expect(title.componentInstance.title())
        .toBe('Actualización de usuario');
    });

    it('should render admin update user form', () => {
      const form = fixture.debugElement.query(
        By.css('admin-update-user-form')
      );

      expect(form)
        .toBeTruthy();
    });

    it('should pass user to admin update user form', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      const form = fixture.debugElement.query(
        By.directive(MockAdminUpdateUserForm)
      );

      expect(
        form.componentInstance.userToUpdate()
      ).toEqual(mockUser);
    }));
  });

  describe('Without route id', () => {
    let emptyFixture: ComponentFixture<AdminUpdateUserPage>;
    let emptyComponent: AdminUpdateUserPage;

    beforeEach(async () => {
      const emptyDirectorsBoardApi =
        jasmine.createSpyObj<DirectorsBoardApi>(
          'DirectorsBoardApi',
          ['getAdminUser']
        );

      emptyDirectorsBoardApi.getAdminUser
        .and
        .returnValue(of(mockUser));

      await TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [AdminUpdateUserPage],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: DirectorsBoardApi,
            useValue: emptyDirectorsBoardApi
          },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({})
            }
          }
        ]
      })
      .overrideComponent(AdminUpdateUserPage, {
        remove: {
          imports: [
            GetBackTitle,
            AdminUpdateUserForm
          ]
        },
        add: {
          imports: [
            MockGetBackTitle,
            MockAdminUpdateUserForm
          ]
        }
      })
      .compileComponents();

      emptyFixture = TestBed.createComponent(
        AdminUpdateUserPage
      );

      emptyComponent = emptyFixture.componentInstance;

      emptyFixture.detectChanges();
    });

    it('should return undefined when id does not exist', fakeAsync(() => {
      tick();

      emptyFixture.detectChanges();

      expect(
        emptyComponent['userResource'].value()
      ).toBeUndefined();
    }));
  });
});
