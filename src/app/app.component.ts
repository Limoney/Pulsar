import { Component } from '@angular/core';
import { appPagesTransition } from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    appPagesTransition
  ]
})
export class AppComponent {
  title = 'Pulsar';

  test()
  {
    console.log("main-route activated");

  }
}
