export class PagedList<T> {
    CurrentPage: number;
    TotalPages: number;
    PageSize: number;
    TotalCount: number;
    Items: T[];
}