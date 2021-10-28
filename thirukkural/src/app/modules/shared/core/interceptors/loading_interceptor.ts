
import { Injectable } from "@angular/core";
import { finalize, tap } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, ReplaySubject } from "rxjs";
import { LoadingserviceService } from "../loading/loadingservice.service";


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService : LoadingserviceService) { }

  private load : string = "show";

  dataStream: ReplaySubject<any> = new ReplaySubject();

  dataStream$(): Observable<any> {
      return this.dataStream.asObservable();
  }

  


  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


     // this.loadingService.show();
      this.loadingService.callComponentMethod();

      this.dataStream.next(true);
    //how to update the request Parameters
    const updatedRequest = request.clone({
      headers: request.headers.set("Authorization", "Some-dummyCode")
    });

    
    //logging the updated Parameters to browser's console
    console.log("Before making api call : ", updatedRequest);

    return next.handle(request).pipe(
      tap(
        event => {
          //logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
            console.log("api call success :", event);
          }
        },
        error => {
          //logging the http response to browser's console in case of a failuer
          if (event instanceof HttpResponse) {
            console.log("api call error :", event);
          }
        },
      ),
      finalize(()=>{
        setTimeout(() => {
          this.load = "hide"
          this.loadingService.hide();
      }, 4000);
      })
    
    )
  }
}