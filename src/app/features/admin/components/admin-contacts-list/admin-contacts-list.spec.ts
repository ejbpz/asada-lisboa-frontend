import { FormBuilder } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContactApi } from '@core/services/contact-api';
import { AdminContactsList } from './admin-contacts-list';
import { ToastMessage } from '@shared/services/toast-message';

describe('AdminContactsList', () => {
  let fixture: ComponentFixture<AdminContactsList>;
  let component: AdminContactsList;

  let api: jasmine.SpyObj<ContactApi>;
  let toast: jasmine.SpyObj<ToastMessage>;

  const mockDialog = () => {
    const dialog = document.createElement('dialog');
    dialog.showModal = jasmine.createSpy('showModal');
    dialog.close = jasmine.createSpy('close');
    return dialog;
  };

  beforeEach(async () => {
    api = jasmine.createSpyObj('ContactApi', [
      'createOrEditContact',
      'deleteContact'
    ]);

    toast = jasmine.createSpyObj('ToastMessage', [
      'success',
      'error'
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminContactsList],
      providers: [
        FormBuilder,
        { provide: ContactApi, useValue: api },
        { provide: ToastMessage, useValue: toast }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminContactsList);
    component = fixture.componentInstance;

    component.contactsInput = {
      subscribe: () => {},
    } as any;

    (component as any).contactsInput = () => [
      {
        id: '1',
        contactType: 'Teléfono',
        value: '8888-8888',
        order: 1
      }
    ];

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should open delete modal and set selectedId', () => {
    const dialog = mockDialog();

    (component as any).deleteModal = () => ({
      nativeElement: dialog
    });

    component.openDeleteModal('123');

    expect(component.selectedId()).toBe('123');
    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('should close delete modal and reset selectedId', () => {
    const dialog = mockDialog();

    (component as any).deleteModal = () => ({
      nativeElement: dialog
    });

    component.openDeleteModal('123');
    component.closeDeleteModal();

    expect(component.selectedId()).toBeNull();
    expect(dialog.close).toHaveBeenCalled();
  });

  it('should delete contact successfully', () => {
    const dialog = mockDialog();

    (component as any).deleteModal = () => ({
      nativeElement: dialog
    });

    api.deleteContact.and.returnValue(of(void 0));

    component.openDeleteModal('123');
    component.confirmDelete();

    expect(api.deleteContact).toHaveBeenCalledWith('123');
    expect(toast.success).toHaveBeenCalled();
  });

  it('should handle delete error', () => {
    const dialog = mockDialog();

    (component as any).deleteModal = () => ({
      nativeElement: dialog
    });

    api.deleteContact.and.returnValue(
      throwError(() => ({ message: 'error' }))
    );

    component.openDeleteModal('123');
    component.confirmDelete();

    expect(toast.error).toHaveBeenCalledWith('error');
  });

  it('should open create/edit modal', () => {
    const dialog = mockDialog();

    (component as any).createEditModal = () => ({
      nativeElement: dialog
    });

    component.openCreateEditModal(null);

    expect(component.selectedContact()).toBeNull();
    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('should create or update contact and update list', () => {
    const dialog = mockDialog();

    (component as any).createEditModal = () => ({
      nativeElement: dialog
    });

    api.createOrEditContact.and.returnValue(
      of({
        id: '2',
        value: '9999-9999',
        contactType: 'Teléfono',
        order: 2
      })
    );

    component.contactForm.setValue({
      value: '9999-9999',
      contactType: 'Teléfono',
      order: 2
    });

    component.openCreateEditModal(null);
    component.onContactForm();

    expect(api.createOrEditContact).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
    expect(dialog.close).toHaveBeenCalled();
  });

  it('should not submit when form is invalid', () => {
    component.contactForm.setValue({
      value: '',
      contactType: '',
      order: ''
    });

    component.onContactForm();

    expect(api.createOrEditContact).not.toHaveBeenCalled();
  });

  it('should not call API when loading is true', () => {
    (component as any).isLoading.set(true);

    api.createOrEditContact.and.returnValue(of({} as any));

    component.contactForm.setValue({
      value: '8888-8888',
      contactType: 'Teléfono',
      order: 1
    });

    component.onContactForm();

    expect(api.createOrEditContact).not.toHaveBeenCalled();
  });
});
