import { Component, OnInit, ElementRef,Renderer2, ViewChild} from '@angular/core';
import { Suggester } from './Suggester';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
@ViewChild('editor') editor:ElementRef;

  title = 'suggest';
  sql: string = "";
  suggester: Suggester;
  s:any;
  top: number = 0;
  left: number = 0;


  ngOnInit() {
    this.suggester = new Suggester({
      table1: ['col1', 'col2', 'col3'],
      foo_table: ['fc1', 'fc2'],
      user: ['col1','name','email'],
      prduct:['name','id','desc']
    });
  }

 

  //
  // Textarea change event listener.
  //
  onSQLChange(e) {
    // Get top and left position for suggestionList component
    const clientRect = this.editor.nativeElement.getBoundingClientRect();
    this.top = clientRect.top;
    this.left = clientRect.left + this.editor.nativeElement.selectionStart;  
    // Get suggestions 
    this.s = this.suggester.getSuggestions(this.sql, this.editor.nativeElement.selectionStart);
    
  }

  //
  // Handle for suggestionList event emitter. This routine is fired when
  // an item is selected from the dropdown list.
  //
  onSelection(item) {
    console.log("selected item: ", item);
    let caret = this.editor.nativeElement.selectionStart;
    const newSQL = this.suggester.getNewSQL(caret, this.sql, item);
    this.sql = newSQL;
    this.editor.nativeElement.focus();

    // Tried to put the caret next to the selected item, but couldn't get it to work
    //
    this.editor.nativeElement.selectionEnd = caret+item.snippet.length;
    this.editor.nativeElement.setSelectionRange(caret+item.snippet.length+1,caret+item.snippet.length+1, 0);
  }
}

