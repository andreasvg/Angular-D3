import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public data: any[] = [{ date: "10/25/2018", value1: 1, value2: 0 },
    { date: "10/26/2018", value1: 3, value2: 0 },
    { date: "10/27/2018", value1: 0, value2: 25 },
    { date: "10/28/2018", value1: 0, value2: 62 },
    { date: "10/29/2018", value1: 5, value2: 5 },
    { date: "10/30/2018", value1: 8, value2: 37 },
    { date: "10/31/2018", value1: 7, value2: 12 },
    { date: "11/01/2018", value1: 11, value2: 55 },
    { date: "11/02/2018", value1: 23, value2: 44 },
    { date: "11/03/2018", value1: 13, value2: 53 },
    { date: "11/04/2018", value1: 15, value2: 18 },
    { date: "11/05/2018", value1: 37, value2: 12 },
    { date: "11/06/2018", value1: 32, value2: 60 },
    { date: "11/07/2018", value1: 38, value2: 60 },
    { date: "11/08/2018", value1: 42, value2: 60 },
    { date: "11/09/2018", value1: 43, value2: 3 },
    { date: "11/10/2018", value1: 21, value2: 3 },
    { date: "11/11/2018", value1: 24, value2: 2 },
    { date: "11/12/2018", value1: 50, value2: 15 },
    { date: "11/13/2018", value1: 53, value2: 3 },
    { date: "11/14/2018", value1: 59, value2: 15 },
    { date: "11/15/2018", value1: 61, value2: 3 },
    { date: "11/16/2018", value1: 62, value2: 19 }];


    public data2: any[] = [{ date: "10/25/2018", value1: 1, schnabel: 13 },
    { date: "10/26/2018", value1: 3, schnabel: 17 },
    { date: "10/27/2018", value1: 0, schnabel: 15 },
    { date: "10/28/2018", value1: 0, schnabel: 27 },
    { date: "10/29/2018", value1: 5, schnabel: 29 },
    { date: "10/30/2018", value1: 8, schnabel: 37 },
    { date: "10/31/2018", value1: 7, schnabel: 32 },
    { date: "11/01/2018", value1: 11, schnabel: 39 },
    { date: "11/02/2018", value1: 23, schnabel: 37 },
    { date: "11/03/2018", value1: 13, schnabel: 44 },
    { date: "11/04/2018", value1: 15, schnabel: 47 },
    { date: "11/05/2018", value1: 37, schnabel: 43 },
    { date: "11/06/2018", value1: 32, schnabel: 49 },
    { date: "11/07/2018", value1: 38, schnabel: 52 },
    { date: "11/08/2018", value1: 42, schnabel: 49 },
    { date: "11/09/2018", value1: 43, schnabel: 54 },
    { date: "11/10/2018", value1: 21, schnabel: 57 },
    { date: "11/11/2018", value1: 24, schnabel: 55 },
    { date: "11/12/2018", value1: 50, schnabel: 57 },
    { date: "11/13/2018", value1: 53, schnabel: 58 },
    { date: "11/14/2018", value1: 59, schnabel: 60 },
    { date: "11/15/2018", value1: 61, schnabel: 58 },
    { date: "11/16/2018", value1: 62, schnabel: 60 }];
}
