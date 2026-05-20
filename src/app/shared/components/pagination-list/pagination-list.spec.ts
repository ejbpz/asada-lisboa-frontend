import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationList } from './pagination-list';

describe('PaginationList', () => {
  let component: PaginationList;
  let fixture: ComponentFixture<PaginationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationList]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationList);
    component = fixture.componentInstance;
  });

  function setInputs(offset: number, total: number) {
    fixture.componentRef.setInput('offset', offset);
    fixture.componentRef.setInput('total', total);
    fixture.detectChanges();
  }

  it('should calculate current page correctly', () => {
    setInputs(0, 100);

    expect((component as any).page()).toBe(1);

    setInputs(8, 100);
    expect((component as any).page()).toBe(2);

    setInputs(16, 100);
    expect((component as any).page()).toBe(3);
  });

  it('should calculate max pages correctly', () => {
    setInputs(0, 32);

    expect((component as any).maxPages()).toBe(4);
  });

  it('should emit next page offset', () => {
    spyOn(component.emmitOffset, 'emit');

    setInputs(0, 100);

    (component as any).nextPage();

    expect(component.emmitOffset.emit).toHaveBeenCalledWith(8);
  });

  it('should emit previous page offset', () => {
    spyOn(component.emmitOffset, 'emit');

    setInputs(16, 100);

    (component as any).beforePage();

    expect(component.emmitOffset.emit).toHaveBeenCalledWith(8);
  });

  it('should not emit when on first page', () => {
    spyOn(component.emmitOffset, 'emit');

    setInputs(0, 100);

    (component as any).beforePage();

    expect(component.emmitOffset.emit).not.toHaveBeenCalled();
  });

  it('should not emit when on last page', () => {
    spyOn(component.emmitOffset, 'emit');

    setInputs(24, 24); // page 3 of 3

    (component as any).nextPage();

    expect(component.emmitOffset.emit).not.toHaveBeenCalled();
  });

  it('should handle negative offset safely', () => {
    spyOn(component.emmitOffset, 'emit');

    setInputs(0, 100);

    (component as any).beforePage();

    expect(component.emmitOffset.emit).not.toHaveBeenCalled();
  });
});
