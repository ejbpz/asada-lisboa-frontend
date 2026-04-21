import { SortDirection } from "@shared/enums/sort-direction.enum";

export interface SearchSortRequest {
  search: string | null,
  sortBy: string | null,
  offset: number | null;
  filterBy: string | null,
  sortDirection: SortDirection
}
