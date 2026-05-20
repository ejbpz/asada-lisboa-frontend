import { TestBed } from '@angular/core/testing';
import { HotToastService } from '@ngxpert/hot-toast';
import { ToastMessage } from './toast-message';

describe('ToastMessage', () => {
  let service: ToastMessage;
  let toastSpy: jasmine.SpyObj<HotToastService>;

  beforeEach(() => {
    toastSpy = jasmine.createSpyObj('HotToastService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        ToastMessage,
        { provide: HotToastService, useValue: toastSpy }
      ]
    });

    service = TestBed.inject(ToastMessage);
  });

  it('should show success toast', () => {
    service.success('ok');

    expect(toastSpy.show).toHaveBeenCalledWith('ok', {
      icon: '✔',
      theme: 'snackbar',
      position: 'top-right'
    });
  });

  it('should show error toast', () => {
    service.error('fail');

    expect(toastSpy.show).toHaveBeenCalledWith('fail', {
      icon: '❌',
      theme: 'snackbar',
      position: 'top-right'
    });
  });

  it('should show warning toast', () => {
    service.warning('warn');

    expect(toastSpy.show).toHaveBeenCalledWith('warn', {
      icon: '⚠',
      theme: 'snackbar',
      position: 'top-right'
    });
  });

  it('should show info toast', () => {
    service.info('info');

    expect(toastSpy.show).toHaveBeenCalledWith('info', {
      icon: 'ℹ',
      theme: 'snackbar',
      position: 'top-right'
    });
  });
});
