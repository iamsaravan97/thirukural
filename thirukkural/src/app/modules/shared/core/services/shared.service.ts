import { EventEmitter, Injectable, Output } from '@angular/core';
import { FilterListDto } from 'src/app/model/filterlis';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  
  @Output() onChangeFilterEmit = new EventEmitter<FilterListDto>();

  onChangeFilter(filterList:FilterListDto){
    this.onChangeFilterEmit.emit(filterList);
  }

  @Output() resetFilerEmit = new EventEmitter<any>();

  onResetFilter(e){
    this.resetFilerEmit.emit(e);
  }
}
