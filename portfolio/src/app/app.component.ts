import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { VishvaData } from '@yashendra-gupta/yg-vishva';

import '@yashendra-gupta/yg-vishva/yg-vishva.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Yashendra Gupta Portfolio';
  vishvaData: VishvaData;
  showYgVishva: boolean = false;

  constructor(private http: HttpClient) {
    this.http.get<any>(
      "https://raw.githubusercontent.com/yashendra-gupta/yashendra-gupta.github.io/assets/assets/data/portfolio-3d.json")
      .subscribe((data: any) =>  {
        this.vishvaData = data;
        this.showYgVishva = true;
      });
  }
}
