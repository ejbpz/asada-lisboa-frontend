import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StorageBrowser } from './storage-browser';

describe('StorageBrowser (browser)', () => {
  let service: StorageBrowser;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(StorageBrowser);

    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue('value');
    spyOn(localStorage, 'removeItem');
  });

  it('should set value in localStorage', () => {
    service.set('key', 'value');

    expect(localStorage.setItem).toHaveBeenCalledWith('key', 'value');
  });

  it('should get value from localStorage', () => {
    const result = service.get('key');

    expect(localStorage.getItem).toHaveBeenCalledWith('key');
    expect(result).toBe('value');
  });

  it('should remove value from localStorage', () => {
    service.remove('key');

    expect(localStorage.removeItem).toHaveBeenCalledWith('key');
  });
});

describe('StorageBrowser (server)', () => {
  let service: StorageBrowser;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    service = TestBed.inject(StorageBrowser);

    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'removeItem');
  });

  it('should return null on get', () => {
    const result = service.get('key');

    expect(result).toBeNull();
    expect(localStorage.getItem).not.toHaveBeenCalled();
  });

  it('should not call setItem', () => {
    service.set('key', 'value');

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should not call removeItem', () => {
    service.remove('key');

    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });
});
