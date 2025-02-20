import { IPaginationConfig } from "@/types/IPaginationConfig";

export interface searchConfig {
  searchString: string;
  searchField: string;
  searchType?: 'regex' | 'eq';
}

export const pagitionQueryGenerator = (
  url: string,
  { currentPage, sort, limit, sortOrder }: IPaginationConfig,
  searchConfig?: searchConfig[]
) => {
  const queryParams: string[] = [];
  if (currentPage) {
    queryParams.push(`page=${currentPage}`);
  }
  if (limit) {
    queryParams.push(`limit=${limit}`);
  }
  if (sort) {
    queryParams.push(`sort=${sortOrder ?? ''}${sort}`);
  }
  if (searchConfig?.length) {
    searchConfig.forEach(({ searchString, searchField, searchType = 'regex' }) => {
      if (searchString && searchField) {
        queryParams.push(`filter.${searchField}=string.${searchType}.${searchString}`);
      }
    });
  }
  if (queryParams.length === 0) return url;

  return `${url}?${queryParams.join('&')}`;
};
