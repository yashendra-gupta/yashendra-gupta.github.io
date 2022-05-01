import { Component } from '@angular/core';
import { App } from './3d/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Yashendra Gupta Portfolio';
  
  ngAfterViewInit(): void {
    const app3d = new App('renderCanvas');
    app3d.run();
  }
}
