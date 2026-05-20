import { ActivatedRoute, RouterLink } from '@angular/router';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import ConfirmEmailPage from './confirm-email-page';
import { AccountApi } from '@core/services/account-api';

class AccountApiMock {
  confirmEmail = jasmine.createSpy('confirmEmail');
}

class ActivatedRouteMock {
  private subject = new Subject<any>();

  queryParams = this.subject.asObservable();

  emit(params: any) {
    this.subject.next(params);
  }
}

describe('ConfirmEmailPage', () => {
  let fixture: ComponentFixture<ConfirmEmailPage>;
  let component: ConfirmEmailPage;

  let accountApi: AccountApiMock;
  let route: ActivatedRouteMock;

  beforeEach(async () => {
    accountApi = new AccountApiMock();
    route = new ActivatedRouteMock();

    await TestBed.configureTestingModule({
      imports: [
        ConfirmEmailPage,
        RouterLink
      ],
      providers: [
        { provide: AccountApi, useValue: accountApi },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call confirmEmail when valid params exist', () => {
    accountApi.confirmEmail.and.returnValue(of(true));

    route.emit({
      email: 'test@mail.com',
      token: 'valid-token'
    });

    fixture.detectChanges();

    expect(accountApi.confirmEmail).toHaveBeenCalledWith(
      'test@mail.com',
      'valid-token'
    );
  });

  it('should not call confirmEmail when params are missing', () => {
    accountApi.confirmEmail.and.returnValue(of(true));

    route.emit({
      email: null,
      token: null
    });

    fixture.detectChanges();

    expect(accountApi.confirmEmail).not.toHaveBeenCalled();
  });

  it('should show error state when API fails', fakeAsync(() => {
    accountApi.confirmEmail.and.returnValue(
      throwError(() => new Error('Invalid token'))
    );

    route.emit({
      email: 'test@mail.com',
      token: 'bad-token'
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.confirmEmailResource.error()).toBeTruthy();
  }));

  it('should complete request and not remain loading', fakeAsync(() => {
    accountApi.confirmEmail.and.returnValue(
      of({ success: true })
    );

    route.emit({
      email: 'test@mail.com',
      token: 'valid-token'
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.confirmEmailResource.isLoading()).toBeFalse();
  }));
});
