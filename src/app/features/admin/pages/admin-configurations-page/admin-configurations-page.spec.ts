import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContactApi } from '@core/services/contact-api';
import { AboutUsApi } from '@core/services/about-us-api';
import AdminConfigurationsPage from './admin-configurations-page';
import { ContactResponse } from '@public/interfaces/contact-response.interface';
import { AboutUsResponse } from '@public/interfaces/about-us-response.interface';

describe('AdminConfigurationsPage', () => {
  let component: AdminConfigurationsPage;
  let fixture: ComponentFixture<AdminConfigurationsPage>;

  let contactApi: jasmine.SpyObj<ContactApi>;
  let aboutUsApi: jasmine.SpyObj<AboutUsApi>;

  const mockContacts: ContactResponse[] = [
    {
      id: 'contact-1',
      contactType: 'Correo',
      value: 'test@test.com',
      order: 1
    } as ContactResponse,
    {
      id: 'contact-2',
      value: '8888-8888',
      contactType: 'Teléfono',
      order: 2
    } as ContactResponse
  ];

  const mockAboutUs: AboutUsResponse[] = [
    {
      id: 'about-1',
      sectionType: 'Historia',
      content: 'Contenido historia',
      order: 1,
    } as AboutUsResponse,
    {
      id: 'about-2',
      sectionType: 'Misión',
      content: 'Contenido misión',
      order: 2,
    } as AboutUsResponse
  ];

  beforeEach(async () => {
    contactApi = jasmine.createSpyObj<ContactApi>(
      'ContactApi',
      ['getAdminContacts']
    );

    aboutUsApi = jasmine.createSpyObj<AboutUsApi>(
      'AboutUsApi',
      ['getAboutUsInformation']
    );

    contactApi.getAdminContacts
      .and
      .returnValue(of(mockContacts));

    aboutUsApi.getAboutUsInformation
      .and
      .returnValue(of(mockAboutUs));

    await TestBed.configureTestingModule({
      imports: [
        AdminConfigurationsPage
      ],
      providers: [
        provideRouter([]),
        {
          provide: ContactApi,
          useValue: contactApi
        },
        {
          provide: AboutUsApi,
          useValue: aboutUsApi
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(
      AdminConfigurationsPage
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call contacts list service', () => {
      expect(contactApi.getAdminContacts)
        .toHaveBeenCalled();
    });

    it('should call configuration list service', () => {
      expect(aboutUsApi.getAboutUsInformation)
        .toHaveBeenCalled();
    });

    it('should set contacts data', () => {
      expect(component['contacts']())
        .toEqual(mockContacts);
    });

    it('should set about us data', () => {
      expect(component['aboutUs']())
        .toEqual(mockAboutUs);
    });
  });

  describe('Contacts service', () => {
    it('should update contacts signal', () => {
      component['contacts'].set([]);

      component['contactsList']();

      expect(component['contacts']())
        .toEqual(mockContacts);
    });
  });

  describe('Configurations service', () => {
    it('should update about us signal', () => {
      component['aboutUs'].set([]);

      component['configurationList']();

      expect(component['aboutUs']())
        .toEqual(mockAboutUs);
    });
  });

  describe('Template rendering', () => {
    it('should render page title', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Configuraciones');
    });

    it('should render page description', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain(
          'Desde aquí puedes editar la información general de la ASADA'
        );
    });

    it('should render admin contacts list component', () => {
      const contactsList = fixture.debugElement.query(
        By.css('admin-contacts-list')
      );

      expect(contactsList)
        .toBeTruthy();
    });

    it('should render admin about us list component', () => {
      const aboutUsList = fixture.debugElement.query(
        By.css('admin-about-us-list')
      );

      expect(aboutUsList)
        .toBeTruthy();
    });

    it('should pass contacts input to contacts list', () => {
      const contactsList = fixture.debugElement.query(
        By.css('admin-contacts-list')
      );

      expect(
        contactsList.componentInstance.contactsInput()
      ).toEqual(mockContacts);
    });

    it('should pass about us input to about us list', () => {
      const aboutUsList = fixture.debugElement.query(
        By.css('admin-about-us-list')
      );

      expect(
        aboutUsList.componentInstance.aboutUsInput()
      ).toEqual(mockAboutUs);
    });
  });
});
