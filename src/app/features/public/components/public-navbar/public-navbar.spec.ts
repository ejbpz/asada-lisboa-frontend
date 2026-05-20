import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicNavbar } from './public-navbar';
import { AuthApi } from '@core/services/auth-api';

describe('PublicNavbar', () => {
  let component: PublicNavbar;
  let fixture: ComponentFixture<PublicNavbar>;

  const authApiMock = {
    isAuthenticated: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicNavbar],
      providers: [
        provideRouter([]),
        { provide: AuthApi, useValue: authApiMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicNavbar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login link when not authenticated', () => {
    authApiMock.isAuthenticated.and.returnValue(false);

    fixture.detectChanges();

    expect(component['authLink']().title).toBe('Iniciar Sesión');
    expect(component['authLink']().link).toBe('cuenta/iniciar-sesion');
  });

  it('should show admin link when authenticated', () => {
    authApiMock.isAuthenticated.and.returnValue(true);

    fixture.detectChanges();

    expect(component['authLink']().title).toBe('Panel Administrativo');
    expect(component['authLink']().link).toBe('admin');
  });

  it('should render navigation links', () => {
    authApiMock.isAuthenticated.and.returnValue(false);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Nosotros');
    expect(compiled.textContent).toContain('Galería');
    expect(compiled.textContent).toContain('Documentos');
    expect(compiled.textContent).toContain('Noticias');
    expect(compiled.textContent).toContain('Contacto');
    expect(compiled.textContent).toContain('Recibos');
  });

  it('should render internal links for Nosotros', () => {
    authApiMock.isAuthenticated.and.returnValue(false);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('¿Quiénes Somos?');
    expect(compiled.textContent).toContain('Junta Directiva');
  });

  it('should render auth link in DOM', () => {
    authApiMock.isAuthenticated.and.returnValue(true);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Panel Administrativo');
  });

  it('should contain router links', () => {
    authApiMock.isAuthenticated.and.returnValue(false);

    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.css('a'));

    expect(links.length).toBeGreaterThan(0);
  });
});
