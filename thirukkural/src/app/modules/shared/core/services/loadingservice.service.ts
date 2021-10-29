import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingserviceService {

  @Output() showLoaderEvent= new EventEmitter<any>();

  constructor() { }

  show(){
    this.showLoaderEvent.emit(true);
  }

  hide(){
    this.showLoaderEvent.emit(false);
  }

  private componentMethodCallSource = new Subject<any>();
  
  // Observable string streams
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  // Service message commands
  callComponentMethod() {
    this.componentMethodCallSource.next();
  }
  
}
