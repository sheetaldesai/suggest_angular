import { SuggestionType, SuggestionKeywords, Suggestion } from './core';

//
// Class responsible for getting suggestions for columns and tables.
//
export class Suggester {
    tables = {};
    columns = {};
    startingKeywords: Suggestion[];
    suggestCols: Boolean;
    colsAndTables: any;

    constructor(tables) {
       
       
      this.tables = tables;
      //
      // Create dictionary of column names where column name is the key and 
      // tables that contain that column are the values
      //
      Object.keys(this.tables).forEach(table => {
        this.tables[table].forEach(col => {
            if (this.columns[col] === undefined) {
                this.columns[col] = [];
            } 
            this.columns[col].push(table);
        })
      })
      console.log("Columns ", this.columns);
    }
  
    //
    // Get suggestions for column and table names. 
    // Currently we only support 'SELECT' queries.
    //
    getSuggestions(statement, cursorPosition) {
        
        let suggestions: Suggestion[] = [];

        //
        // Get user entered column and table names
        //
        this.colsAndTables = this.getColsAndTables(statement);

        //
        // Find out if suggestions are needed for columns or tables.
        // True if column names are to be suggested, false if table names 
        // are to be suggested.
        // 
        this.suggestCols = this.whichSuggestion(statement, cursorPosition);
        
        if(this.suggestCols) {
            // Check if use has specified any tables;
            if (this.colsAndTables && this.colsAndTables.tables ) {
                // User has given table names. Generate a list of columns 
                // for user given tables.
                this.colsAndTables.tables.forEach(table =>  {
                    if (this.tables[table.trim()] !== undefined) {
                        this.tables[table.trim()].forEach(col => {
                            suggestions.push(new Suggestion(SuggestionType.COLUMN, col));
                        })
                    }
                })
            } else {
                // No tables, give list of all columns.
                Object.keys(this.columns).forEach(col => {
                    suggestions.push(new Suggestion(SuggestionType.COLUMN, col));
                })
            }
            //
            // If user has started typing column names then filter the column list on
            // the user entered query.
            //
            if (this.colsAndTables && this.colsAndTables.cols && this.colsAndTables.cols[this.colsAndTables.cols.length-1]) {
                suggestions = this.filter(this.colsAndTables.cols[this.colsAndTables.cols.length-1], suggestions);
            }
        } else {
            // Get table name suggestions.
            // check if cols are present
            if (this.colsAndTables && !this.colsAndTables.cols) {
                // No columns specified. Give list of all tables.
                let tables = Object.keys(this.tables);
                tables.forEach(table => {
                    suggestions.push(new Suggestion(SuggestionType.TABLE, table));
                })
            } else {
                // find tables for the specified columns
                if (this.colsAndTables) {
                    let tmpTables = []
                    this.colsAndTables.cols.forEach(col => {
                        // Get the tables which have this column
                        const colTables = this.columns[col.trim()];
                        console.log("colTables: ", colTables);
                        if (colTables !== undefined) {
                            colTables.forEach(table => {
                                //
                                // if table is not already added then add it.
                                //
                                console.log("Table: ", table);
                                if (!tmpTables.includes(table)) {
                                    suggestions.push(new Suggestion(SuggestionType.TABLE, table));
                                    console.log("Pushing table to tmpTables");
                                    tmpTables.push(table);
                                }
                            })
                        }
                    })
                }
            }
            //
            // Filter suggestions if user has started typing the table names
            //
            if (this.colsAndTables && this.colsAndTables.tables && this.colsAndTables.tables[this.colsAndTables.tables.length-1]) {
                suggestions = this.filter(this.colsAndTables.tables[this.colsAndTables.tables.length-1], suggestions);
            }
        }
      return suggestions;
    }

    //
    // Helper funtion that filters out the suggestions based of text input.
    //
    filter(text, collection) {
        return collection.filter(el => {
            // console.log("el ", el);
            //console.log("last col: ",colsAndTables.cols[colsAndTables.cols.length-1]);        
            return (el.snippet.toLowerCase().indexOf(text.toLowerCase()) > -1 );
        })
    }

    //
    // Helper function that decided whether column or table suggestions are 
    // needed based on the cursor position within the statement.
    //
    whichSuggestion(statement, cursorPosition) {
        let suggestCols = false;
        const selectEnd = SuggestionKeywords.SELECT.length;
        const fromSIndx = statement.toLowerCase().indexOf(SuggestionKeywords.FROM);
        const fromEIndx = fromSIndx + SuggestionKeywords.FROM.length;
        const whereIndx = statement.toLowerCase().indexOf(SuggestionKeywords.WHERE);

        if (cursorPosition >= selectEnd ) {
            if (fromSIndx >= 0) {
                if (cursorPosition <= fromSIndx) {
                    //
                    // If cursor is between select and from then
                    // suggest columns.
                    suggestCols = true;
                }
            } else {
                // Cursor after select and No from keyword in statement.
                // Suggest columns.
                suggestCols = true;
            }
        } else if (cursorPosition >= fromEIndx) {
            // cursor is after from keyword, suggest tables.
            suggestCols = false;
        }

        return suggestCols;
    }

    //
    // Helper function that returns an object with user entered column
    // and table names.
    //
    getColsAndTables(statement) {
        if (statement.toLowerCase().startsWith(SuggestionKeywords.SELECT)) {
            //
            // Does the sql has 'from' and 'where' clause?
            //
            const selectEnd = SuggestionKeywords.SELECT.length;
            const fromSIndx = statement.toLowerCase().indexOf(SuggestionKeywords.FROM);
            const fromEIndx = fromSIndx + SuggestionKeywords.FROM.length;
            const whereIndx = statement.toLowerCase().indexOf(SuggestionKeywords.WHERE);
            let colNames: string[] = [];
            let tableNames: string[] = [];
  
            console.log(`selectEnd: ${selectEnd} fromIndex: ${fromSIndx} whereIndx: ${whereIndx}`);
            colNames = this.getColNames(statement, selectEnd, fromSIndx);
            tableNames = this.getTableNames(statement, fromSIndx, fromEIndx, whereIndx);

            return {cols: colNames, tables: tableNames};
            
        }  
    }

    getColNames(statement, selectEnd, fromSIndx) {
        if (fromSIndx >= 0) {
            let c = statement.toLowerCase().substr(selectEnd+1, fromSIndx-selectEnd-1).trim();
            if (c) {
                return c.split(",");
            }
        }  else {
            let c = statement.toLowerCase().substr(selectEnd+1).trim();
            if (c) {
                return c.split(",");
            } 
        }
    }

    getTableNames(statement, fromSIndx, fromEIndx, whereIndx) {
        let t = "";

        if (fromSIndx >= 0) {
            if (whereIndx >= 0) {
                t = statement.toLowerCase().substr(fromEIndx+1, whereIndx-fromEIndx-1).trim();
                
            } else {
                t = statement.toLowerCase().substr(fromEIndx+1).trim();
            }
        }

        if (t) {
            console.log("t ", t);
            return t.split(",");
        }
    }

    //
    // Insert the selected item from dropdown to the textarea content and return
    // new sql.
    //
    getNewSQL(selectionStart, sql, item) {
        let newSQL: string = "";
        console.log("getNewSQL suggestCols ", this.suggestCols);
        console.log("selectionStart sql ", selectionStart, sql);
        // If user has started typing the column/table names and then 
        // selected the suggestion from dropdown then we want to replace 
        // the selected item with whatever user has entered.
        if (this.suggestCols) {
            //
            // Get the last column name, find it in our statement and 
            // replace it with selected item.
            //
            if (this.colsAndTables && this.colsAndTables.cols) {
                // get last col
                let lastCol = this.colsAndTables.cols[this.colsAndTables.cols.length-1];
                if (lastCol) {
                    
                    sql = sql.substr(0, selectionStart - lastCol.length) + sql.substr(selectionStart+1);
                    selectionStart = selectionStart - lastCol.length;
                    
                }
            }
        } else {
            if (this.colsAndTables && this.colsAndTables.tables) {
                // get last col
                let lastTable = this.colsAndTables.tables[this.colsAndTables.tables.length-1];
                if (lastTable) {
                    sql = sql.substr(0, selectionStart - lastTable.length) + sql.substr(selectionStart+1);
                    selectionStart = selectionStart - lastTable.length;
                   
                }
            }
        }
        newSQL = sql.substr(0, selectionStart) + item.snippet + " " + sql.substr(selectionStart+1);

        return newSQL;

    }
}