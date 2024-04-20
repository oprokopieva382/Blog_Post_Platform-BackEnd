import { SortDirection } from "mongodb";

export const queryFilter = (search: any) => {
  return {
    pageNumber: search.pageNumber ? +search.pageNumber : 1,
    pageSize: search.pageSize !== undefined ? +search.pageSize : 10,
    sortBy: search.sortBy ? search.sortBy : "createdAt",
    sortDirection: search.sortDirection
      ? (search.sortDirection as SortDirection)
      : "desc",
    searchNameTerm: search.searchNameTerm ? search.searchNameTerm : null,
  };
};
