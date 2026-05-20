import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContactBoard } from './contact-board';
import { ContactApi } from '@core/services/contact-api';

describe('ContactBoard', () => {
  let component: ContactBoard;
  let fixture: ComponentFixture<ContactBoard>;

  let contactApi: jasmine.SpyObj<ContactApi>;

  const mockContacts = [
    {
      id: '1',
      contactType: 'Correo',
      value: 'test@test.com'
    },
    {
      id: '2',
      contactType: 'Teléfono',
      value: '+50688888888'
    }
  ] as any;

  beforeEach(async () => {
    contactApi = jasmine.createSpyObj<ContactApi>('ContactApi', [
      'getContactInformation'
    ]);

    contactApi.getContactInformation.and.returnValue(of(mockContacts));

    await TestBed.configureTestingModule({
      imports: [ContactBoard],
      providers: [
        { provide: ContactApi, useValue: contactApi }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactBoard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call API on ngAfterViewInit', fakeAsync(() => {
    tick();
    fixture.detectChanges();

    expect(contactApi.getContactInformation).toHaveBeenCalled();
  }));

  it('should set contact data from API', fakeAsync(() => {
    tick();
    fixture.detectChanges();

    expect(component['contactData']()).toEqual(mockContacts);
  }));

  it('should not call API if already loading', () => {
    component['isLoading'].set(true);

    component.principalApiService();

    expect(contactApi.getContactInformation).not.toHaveBeenCalled();
  });

  it('should return tel link for phone number', () => {
    const result = component.contactLink('+50688888888');
    expect(result).toBe('tel:+50688888888');
  });

  it('should return mailto link for email', () => {
    const result = component.contactLink('test@test.com');
    expect(result).toBe('mailto:test@test.com');
  });

  it('should return url for web links', () => {
    const result = component.contactLink('https://google.com');
    expect(result).toBe('https://google.com');
  });

  it('should return null for unknown format', () => {
    const result = component.contactLink('random-text');
    expect(result).toBeNull();
  });

  it('should return phone icon', () => {
    const icon = component.contactIcon('+50688888888');
    expect(icon).toBe('/assets/icons/phone-icon.svg');
  });

  it('should return mail icon', () => {
    const icon = component.contactIcon('test@test.com');
    expect(icon).toBe('/assets/icons/mail-icon.svg');
  });

  it('should return web icon', () => {
    const icon = component.contactIcon('https://site.com');
    expect(icon).toBe('/assets/icons/web-icon.svg');
  });

  it('should return user icon fallback', () => {
    const icon = component.contactIcon('unknown');
    expect(icon).toBe('/assets/icons/user-icon.svg');
  });

  it('should return link message for web', () => {
    const msg = component.contactTextMessage(
      'https://site.com',
      'Sitio web'
    );

    expect(msg).toBe('Link para Sitio web');
  });

  it('should return raw value for non-web', () => {
    const msg = component.contactTextMessage(
      'test@test.com',
      'Correo'
    );

    expect(msg).toBe('test@test.com');
  });
});
