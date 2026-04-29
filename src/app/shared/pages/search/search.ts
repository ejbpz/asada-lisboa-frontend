import { Injectable, signal, inject } from '@angular/core';
import {SearchApi} from "@core/services/search-api"
import { SearchReponse } from '@public/interfaces/search-reponse.interface';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Search {

  private service = inject(SearchApi);

  //Estado global reutilizable
  query = signal('');
  results = signal<SearchReponse[]>([]);
  loading = signal(false);

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => this.buscar(query));
  }

  updateQuery(value: string) {
    this.query.set(value);
    this.searchSubject.next(value);
  }

  buscarManual() {
  this.buscar(this.query()); // búsqueda directa
}

  buscar(query: string) {
    if (!query.trim()) {
      this.results.set([]);
      return;
    }

    this.loading.set(true);

    this.service.search({ 
      query,
      page: 1,
      pageSize: 10
    }).subscribe({
      next: (data) => {
        this.results.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  clear() {
    this.query.set('');
    this.results.set([]);
  }
}
