import { Component } from '@angular/core';
import { tempName } from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    tempName
  ]
})
export class AppComponent {
  title = 'Pulsar';

  test()
  {
    console.log("main-route activated");
    
  }
}
