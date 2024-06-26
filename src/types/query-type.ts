export type QueryType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 1 | -1;
  searchNameTerm: string | null;
};

export type QueryUserType = {
  sortBy: string;
  sortDirection: 1 | -1;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
};

export type QueryCommentsType = {
  sortBy: string;
  sortDirection: 1 | -1;
  pageNumber: number;
  pageSize: number;
};
