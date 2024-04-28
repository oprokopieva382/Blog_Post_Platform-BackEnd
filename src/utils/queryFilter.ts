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

export const userQueryFilter = (search: any) => {
  return {
    pageNumber: search.pageNumber ? +search.pageNumber : 1,
    pageSize: search.pageSize !== undefined ? +search.pageSize : 10,
    sortBy: search.sortBy ? search.sortBy : "createdAt",
    sortDirection: search.sortDirection
      ? (search.sortDirection as SortDirection)
      : "desc",
    searchLoginTerm: search.searchLoginTerm ? search.searchLoginTerm : null,
    searchEmailTerm: search.searchEmailTerm ? search.searchEmailTerm : null,
  };
};

export const commentsQueryFilter = (search: any) => {
  return {
    pageNumber: search.pageNumber ? +search.pageNumber : 1,
    pageSize: search.pageSize !== undefined ? +search.pageSize : 10,
    sortBy: search.sortBy ? search.sortBy : "createdAt",
    sortDirection: search.sortDirection
      ? (search.sortDirection as SortDirection)
      : "desc"
  };
};
