export class FilterListDto{
    Id : number;
    ChapterIds : Array<number>;
    SectionIds : Array<number>;
    SubSectionIds : Array<number>;
    PageSize : number;
    PageNumber : number;
}