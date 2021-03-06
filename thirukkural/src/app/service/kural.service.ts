import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Kural } from '../model/kural';
import { retry, catchError } from 'rxjs/operators';
import { Categories } from '../model/categories';
import { environment } from 'src/environments/environment';
import { FilterListDto } from '../model/filterlis';
import { PagedList } from '../model/pagedresults';

@Injectable({
  providedIn: 'root'
})
export class KuralService {
 
  // private endpointURL : string = "http://thirukkuralapi.somee.com/kural/";
  private endpointURL : string =  environment.url

  constructor(private httpClient : HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  //#region service

  public getAllKurals():Observable<Array<Kural>>{
    return this.httpClient.get<Array<Kural>>(this.endpointURL+"GetAllKurals").pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  public getAllChapters():Observable<Array<Categories>>{
    return this.httpClient.get<Array<Categories>>(this.endpointURL+"GetChapters").pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  
  public getAllSections():Observable<Array<Categories>>{
    return this.httpClient.get<Array<Categories>>(this.endpointURL+"GetSections").pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  public getAllSubSections():Observable<Array<Categories>>{
    return this.httpClient.get<Array<Categories>>(this.endpointURL+"GetSubSections").pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  public getKuralById(id:any):Observable<Kural>{
    return this.httpClient.get<Kural>(this.endpointURL+"GetKuralById?kuralId="+id).pipe(
      retry(1),
      catchError(this.httpError)
    )
  }


  public getKuralsByChapterId(chapterId:any):Observable<Array<Kural>>{
    return this.httpClient.get<Array<Kural>>(this.endpointURL+"GetKuralsByChapterId?chapterId="+chapterId).pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  public getKuralsBySectionId(sectionId:any):Observable<Array<Kural>>{
    return this.httpClient.get<Array<Kural>>(this.endpointURL+"GetKuralsBySectionId?sectionId="+sectionId).pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  public getKuralsBySubSectionId(sectionId:any):Observable<Array<Kural>>{
    return this.httpClient.get<Array<Kural>>(this.endpointURL+"GetKuralsBySubSectionId?subSectionId="+sectionId).pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  public getSubSectionsBySection(sectiondId:any):Observable<Array<Categories>>{
    return this.httpClient.get<Array<Categories>>(this.endpointURL+"GetSubSectionsBySection?sectiondId="+sectiondId).pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  public getChaptersBySubSection(subSectionId:any):Observable<Array<Categories>>{
    return this.httpClient.get<Array<Categories>>(this.endpointURL+"GetChaptersBySubSection?subSectionId="+subSectionId).pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  public getSectionsByLevel(id:any,level:any):Observable<Array<Categories>>{
    return this.httpClient.get<Array<Categories>>(this.endpointURL+"GetSectionsByLevel?id="+id+"&level="+level).pipe(
      retry(1),
      catchError(this.httpError)
    )
  }


  public getKuralsByList(filterlist:FilterListDto):Observable<Array<Kural>>{
    return this.httpClient.post<Array<Kural>>(this.endpointURL+"KuralsByList",filterlist).pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  
  public getKuralsPagedResultsByList(filterlist:FilterListDto):Observable<PagedList<Kural>>{
    return this.httpClient.post<PagedList<Kural>>(this.endpointURL+"KuralsPageResultsByList",filterlist).pipe(
      retry(1),
      catchError(this.httpError)
    )
  }
  

  //#endregion

  //#region throw error
  httpError(error) {
    let msg = '';
    if(error.error instanceof ErrorEvent) {
      // client side error
      msg = error.error.message;
    } else {
      // server side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }

  //#endregion
  
}


