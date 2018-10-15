import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrls: ['./suggestion-list.component.css']
})
export class SuggestionListComponent implements OnInit {

  private _suggestions: Array<any> = [];
  private _top: string;
  private _left: string;
  show: Boolean = false;
  
  @Input() 
  set suggestions(s) {
    this._suggestions = s;

    if (this._suggestions && this._suggestions.length > 0) {
      this.show = true;
    }
    //console.log("List suggestions: ", this._suggestions);
  };
  get suggestions() {
    return this._suggestions;
  };

  @Input() 
  set top(t) {
    t = t + 5;
    this._top = t+"px";
    //console.log("set top ", t);
  };
  get top() {
    //console.log("get top ", this._top);
    return this._top;
  };

  @Input() 
  set left(l) {
    l = l + 5;
    this._left = l+"px";
    //console.log("set left ", l)
  };
  get left() {
    //console.log("get left ", this._left)
    return this._left;
  };

  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  select(item) {
    console.log("List selected item ", item);
    this.notify.emit(item);
    this.show = false;
  }

}
