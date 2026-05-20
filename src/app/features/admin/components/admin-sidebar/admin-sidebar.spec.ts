import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminSidebar } from './admin-sidebar';
import { AuthApi } from '@core/services/auth-api';
import { GlobalFooter } from '@shared/components/global-footer/global-footer';

@Component({
  selector: 'global-footer',
  standalone: true,
  template: ''
})
class MockGlobalFooter {}

describe('AdminSidebar', () => {
  let component: AdminSidebar;
  let fixture: ComponentFixture<AdminSidebar>;

  let authApiSpy: jasmine.SpyObj<AuthApi>;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;
  let router: Router;

  beforeEach(async () => {
    authApiSpy = jasmine.createSpyObj('AuthApi', [
      'logoutUser'
    ]);

    breakpointObserverSpy = jasmine.createSpyObj(
      'BreakpointObserver',
      ['observe']
    );

    breakpointObserverSpy.observe.and.returnValue(
      of({
        matches: true,
        breakpoints: {
          '(min-width: 1024px)': true
        }
      })
    );

    authApiSpy.logoutUser.and.returnValue(
      of(void 0)
    );

    await TestBed.configureTestingModule({
      imports: [
        AdminSidebar,
        MockGlobalFooter
      ],
      providers: [
        provideRouter([]),
        {
          provide: AuthApi,
          useValue: authApiSpy
        },
        {
          provide: BreakpointObserver,
          useValue: breakpointObserverSpy
        }
      ]
    })
    .overrideComponent(AdminSidebar, {
      remove: {
        imports: [GlobalFooter]
      },
      add: {
        imports: [MockGlobalFooter]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSidebar);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    spyOn(router, 'navigate')
      .and.returnValue(
        Promise.resolve(true)
      );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize navigation links', () => {
    expect(component['navigationLinks'].length)
      .toBe(6);
  });

  it('should render navigation links', () => {
    const links = fixture.debugElement.queryAll(
      By.css('ul li')
    );

    expect(links.length)
      .toBe(7);
  });

  it('should observe screen size on init', () => {
    component.ngAfterViewInit();

    expect(
      breakpointObserverSpy.observe
    ).toHaveBeenCalledWith([
      '(min-width: 1024px)'
    ]);

    expect(component['isLarge']())
      .toBeTrue();
  });

  it('should set isLarge to false', () => {
    breakpointObserverSpy.observe.and.returnValue(
      of({
        matches: false,
        breakpoints: {
          '(min-width: 1024px)': false
        }
      })
    );

    component.ngAfterViewInit();

    expect(component['isLarge']())
      .toBeFalse();
  });

  it('should logout user and navigate', () => {
    component['onLogout']();

    expect(authApiSpy.logoutUser)
      .toHaveBeenCalled();

    expect(router.navigate)
      .toHaveBeenCalledWith([
        '/cuenta/iniciar-sesion'
      ]);
  });

  it('should navigate even if logout fails', () => {
    authApiSpy.logoutUser.and.returnValue(
      of(void 0)
    );

    component['onLogout']();

    expect(router.navigate)
      .toHaveBeenCalledWith([
        '/cuenta/iniciar-sesion'
      ]);
  });

  it('should render logout button', () => {
    const button = fixture.debugElement.query(
      By.css('button')
    );

    expect(button)
      .toBeTruthy();
  });

  it('should render router outlet', () => {
    const outlet = fixture.debugElement.query(
      By.css('router-outlet')
    );

    expect(outlet)
      .toBeTruthy();
  });

  it('should render footer component', () => {
    const footer = fixture.debugElement.query(
      By.directive(MockGlobalFooter)
    );

    expect(footer)
      .toBeTruthy();
  });

  it('should bind drawer checked state', () => {
    component['isLarge'].set(true);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.debugElement.query(
        By.css('#my-drawer-4')
      ).nativeElement;

    expect(input.checked)
      .toBeTrue();
  });
});
