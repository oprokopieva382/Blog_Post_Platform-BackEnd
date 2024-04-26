import { SortDirection } from "mongodb";

export type QueryType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm: string | null;
};

export type QueryUserType = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
};

export type QueryCommentsType = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
