import { SortDirection } from "mongodb";

export type ParamType = {
  id: string;
};

export type QueryType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm: string | null;
};

