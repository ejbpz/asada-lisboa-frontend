import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReCaptchaLoader } from './re-captcha-loader';

describe('ReCaptchaLoader', () => {
  let service: ReCaptchaLoader;

  describe('server side', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ReCaptchaLoader,
          {
            provide: PLATFORM_ID,
            useValue: 'server'
          }
        ]
      });

      service = TestBed.inject(ReCaptchaLoader);
    });

    it('should resolve immediately on server', async () => {
      await expectAsync(service.load())
        .toBeResolved();
    });
  });

  describe('browser side', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ReCaptchaLoader,
          {
            provide: PLATFORM_ID,
            useValue: 'browser'
          }
        ]
      });

      service = TestBed.inject(ReCaptchaLoader);
    });

    it('should append turnstile script', async () => {
      const appendSpy = spyOn(
        document.body,
        'appendChild'
      ) as jasmine.Spy;

      appendSpy.and.callFake((element: Node) => {
        const script = element as HTMLScriptElement;

        expect(script.src)
          .toContain(
            'challenges.cloudflare.com/turnstile/v0/api.js'
          );

        expect(script.src)
          .toContain('render=explicit');

        setTimeout(() => {
          script.onload?.(
            new Event('load')
          );
        });

        return element;
      });

      await service.load();

      expect(appendSpy)
        .toHaveBeenCalled();
    });

    it('should not append script twice', async () => {
      const appendSpy = spyOn(
        document.body,
        'appendChild'
      ) as jasmine.Spy;

      appendSpy.and.callFake((element: Node) => {
        const script = element as HTMLScriptElement;

        setTimeout(() => {
          script.onload?.(
            new Event('load')
          );
        });

        return element;
      });

      await service.load();
      await service.load();

      expect(appendSpy)
        .toHaveBeenCalledTimes(1);
    });

    it('should reuse loading promise', async () => {
      let resolveLoad!: () => void;

      const appendSpy = spyOn(
        document.body,
        'appendChild'
      ) as jasmine.Spy;

      appendSpy.and.callFake((element: Node) => {
        const script = element as HTMLScriptElement;

        resolveLoad = () => {
          script.onload?.(
            new Event('load')
          );
        };

        return element;
      });

      const promise1 = service.load();
      const promise2 = service.load();

      expect(promise1)
        .toBe(promise2);

      resolveLoad();

      await promise1;
    });

    it('should resolve immediately if already loaded', async () => {
      const appendSpy = spyOn(
        document.body,
        'appendChild'
      ) as jasmine.Spy;

      appendSpy.and.callFake((element: Node) => {
        const script = element as HTMLScriptElement;

        setTimeout(() => {
          script.onload?.(
            new Event('load')
          );
        });

        return element;
      });

      await service.load();
      await service.load();

      expect(appendSpy)
        .toHaveBeenCalledTimes(1);
    });
  });
});
