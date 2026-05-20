import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminAboutUsList } from './admin-about-us-list';
import { AboutUsApi } from '@core/services/about-us-api';
import { ToastMessage } from '@shared/services/toast-message';

class AboutUsApiMock {
  deleteAboutUs = jasmine.createSpy('deleteAboutUs');
  createOrEditAboutUs = jasmine.createSpy('createOrEditAboutUs');
}

class ToastMock {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
}

@Component({
  standalone: true,
  imports: [AdminAboutUsList],
  template: `
    <admin-about-us-list [aboutUsInput]="data"></admin-about-us-list>
  `
})
class HostComponent {
  data = [
    {
      id: '1',
      content: 'Contenido de prueba suficientemente largo para validar',
      sectionType: 'Misión',
      order: 1
    }
  ];
}

describe('AdminAboutUsList', () => {
  let fixture: ComponentFixture<HostComponent>;
  let api: AboutUsApiMock;
  let toast: ToastMock;

  beforeEach(async () => {
    api = new AboutUsApiMock();
    toast = new ToastMock();

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: AboutUsApi, useValue: api },
        { provide: ToastMessage, useValue: toast }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function getComponent(): AdminAboutUsList {
    return fixture.debugElement.query(By.directive(AdminAboutUsList)).componentInstance;
  }

  it('should create and render initial list', () => {
    const component = getComponent();

    expect(component).toBeTruthy();
    expect(component.aboutUs().length).toBe(1);
  });

  it('should open delete modal and set selectedId', () => {
    const component = getComponent();

    const dialog = document.createElement('dialog');
    dialog.showModal = jasmine.createSpy('showModal');
    dialog.close = jasmine.createSpy('close');

    (component as any).deleteModal = () => ({
      nativeElement: dialog
    });

    component.openDeleteModal('123');

    expect(component.selectedId()).toBe('123');
  });

  it('should call delete API and update list', () => {
    const component = getComponent();

    const dialog = document.createElement('dialog');
    dialog.showModal = jasmine.createSpy('showModal');
    dialog.close = jasmine.createSpy('close');

    (component as any).deleteModal = () => ({
      nativeElement: dialog
    });

    api.deleteAboutUs.and.returnValue(of(void 0));

    // set initial state
    component.aboutUs.set([
      {
        id: '1',
        content: 'test',
        sectionType: 'Misión',
        order: 1
      }
    ]);

    component.openDeleteModal('1');
    component.confirmDelete();

    expect(api.deleteAboutUs).toHaveBeenCalledWith('1');
    expect(toast.success).toHaveBeenCalled();
    expect(component.aboutUs().length).toBe(0);
  });

  it('should handle delete error', () => {
    const component = getComponent();

    const dialog = document.createElement('dialog');
    dialog.showModal = jasmine.createSpy('showModal');
    dialog.close = jasmine.createSpy('close');

    (component as any).deleteModal = () => ({
      nativeElement: dialog
    });

    api.deleteAboutUs.and.returnValue(
      throwError(() => ({ message: 'Error delete' }))
    );

    component.openDeleteModal('1');
    component.confirmDelete();

    expect(toast.error).toHaveBeenCalledWith('Error delete');
  });

  it('should create or edit item and update list', () => {
    const component = getComponent();

    const dialog = document.createElement('dialog');
    dialog.showModal = jasmine.createSpy('showModal');
    dialog.close = jasmine.createSpy('close');

    (component as any).createEditModal = () => ({
      nativeElement: dialog
    });

    api.createOrEditAboutUs.and.returnValue(
      of({
        id: '2',
        content: 'x'.repeat(60),
        sectionType: 'Visión',
        order: 2
      })
    );

    component.aboutUsForm.setValue({
      content: 'x'.repeat(60),
      sectionType: 'Visión',
      order: 2
    });

    component.openCreateEditModal(null);
    component.onAboutUsForm();

    expect(api.createOrEditAboutUs).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  it('should not submit invalid form', () => {
    const component = getComponent();

    spyOn(component.aboutUsForm, 'markAllAsTouched');

    component.aboutUsForm.setValue({
      content: '',
      sectionType: '',
      order: ''
    });

    component.onAboutUsForm();

    expect(component.aboutUsForm.markAllAsTouched).toHaveBeenCalled();
    expect(api.createOrEditAboutUs).not.toHaveBeenCalled();
  });

  it('should disable request when loading is true', () => {
    const component = getComponent();

    component.isLoading.set(true);

    api.deleteAboutUs.calls.reset();

    component.openDeleteModal('1');
    component.confirmDelete();

    expect(api.deleteAboutUs).not.toHaveBeenCalled();
  });
});
