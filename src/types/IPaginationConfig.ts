export type IPaginationConfig = {
    currentPage: number;
    sort?: string;
    limit: number;
    sortOrder?: '-' | '';
    isReady?: boolean;
}