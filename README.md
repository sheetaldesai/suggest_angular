1. Requires Node ~8.9.4.
2. Install angular cli globally
   https://cli.angular.io/
   npm install -g @angular/cli
3. Clone git project from GitHub
   git clone https://github.com/sheetaldesai/suggest_angular.git 
4. Run npm install from the project directory (from the same level as         package.json)
5. When node modules are successfully installed, run
   ng serve to start the dev server. Navigate to `http://localhost:4200/`
6. The project currently only handles the 'select' queries. 
7. List of all columns:
    Type 'select' and move cursor after select to get list of all columns.
8. List of all tables:
    Type 'select from' and move cursor after 'from' to get table suggestions.
9. List of columns for particular tables  
    Type 'select from table1,table2' and move cursor between 'select' and 'from' to get a list of columns from table1 and table2
10. List of tables for particular columns
    Type 'select col1,col2 from' and move cursor after 'from' to get a list of tables that have col1 and col2.



# Suggest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
