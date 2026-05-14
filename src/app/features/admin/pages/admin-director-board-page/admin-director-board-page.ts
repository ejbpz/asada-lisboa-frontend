import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchBar } from "@shared/components/search-bar/search-bar";
import { DirectorsBoardApi } from '@core/services/directors-board-api';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { BaseSearchPage } from '@shared/pages/base-search-page/base-search-page';
import { PaginationList } from "@shared/components/pagination-list/pagination-list";
import { AdminUsersList } from "@admin/components/admin-users-list/admin-users-list";
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';

@Component({
  selector: 'admin-director-board-page',
  imports: [GetBackTitle, SearchBar, PaginationList, AdminUsersList, RouterLink],
  templateUrl: './admin-director-board-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full container my-12.5 md:my-25'
  }
})
export default class AdminDirectorBoardPage extends BaseSearchPage<DirectorsBoardApi, DirectorsBoardResponse> {
  // Constructor
  constructor() {
    super(
      inject(Router),
      inject(DirectorsBoardApi),
      inject(ActivatedRoute),
    )
  }

  // Base class implementation
  protected override fetch(service: DirectorsBoardApi, params: HttpParams) {
    return service.getAdminUsers(params);
  }

  protected usersResource = this.resource;

  // Search filters
  protected filterBy = [
    { value: 'name', name: 'Nombre' },
    { value: 'charge', name: 'Cargo' },
  ];

  protected sortBy = [
    { value: 'name', name: 'Nombre' },
    { value: 'charge', name: 'Cargo' },
  ];
}

