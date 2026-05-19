import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SeoManagement } from './seo-management';

describe('SeoManagement', () => {
  let service: SeoManagement;
  let meta: Meta;
  let title: Title;
  let document: Document;

  beforeEach(() => {
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
    document = TestBed.inject(DOCUMENT);
    service = TestBed.inject(SeoManagement);
  });

  it('should set title correctly', () => {
    const spy = spyOn(title, 'setTitle');

    service.setSeo({
      title: 'Noticias'
    });

    expect(spy).toHaveBeenCalledWith(
      'Noticias - ASADA de Urbanización Lisboa'
    );
  });

  it('should update description meta tag', () => {
    const spy = spyOn(meta, 'updateTag');

    service.setSeo({});

    expect(spy).toHaveBeenCalledWith({
      name: 'description',
      content: 'Sitio oficial de la ASADA de Urbanización Lisboa.'
    });
  });

  it('should set noindex robots when configured', () => {
    const spy = spyOn(meta, 'updateTag');

    service.setSeo({
      noIndex: true
    });

    expect(spy).toHaveBeenCalledWith({
      name: 'robots',
      content: 'noindex, nofollow'
    });
  });

  it('should create canonical link when url is provided', () => {
    service.setSeo({
      url: 'https://example.com/page'
    });

    const link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;

    expect(link).toBeTruthy();
    expect(link.href).toContain('https://example.com/page');
  });
});
