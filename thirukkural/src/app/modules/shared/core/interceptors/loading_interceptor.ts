
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
import { LoadingserviceService } from "../services/loadingservice.service";


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService : LoadingserviceService) { }

  private load : string = "hide";


  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


     // this.loadingService.show();
     if(this.load != "show"){
      this.loadingService.show();
    

  }
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
          this.load = "hide";
          this.loadingService.hide();

      }) 
    
    
    )
  }
}