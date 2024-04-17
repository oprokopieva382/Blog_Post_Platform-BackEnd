export type Paginator<T> = {
  /**
   * Pages count is number & optional
   * Page is number & optional
   * Page size is number & optional
   * Total count is number & optional
   * Item is required and includes type of what comes from <T>:
   */
  pagesCount?: number;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  items: T[];
};
