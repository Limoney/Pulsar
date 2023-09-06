import { Component } from '@angular/core';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent {
  protected libraries = [
    {name: "Angular", link: "https://angular.io/"},
    {name: "p5.js", link: "https://p5js.org/"},
    {name: "Hammer.js", link: "https://hammerjs.github.io/"},
    {name: "FontAwesome", link: "https://fontawesome.com/"},
    {name: "GSAP", link: "https://greensock.com/gsap/"},
    {name: "Prism.js", link: "https://prismjs.com/"},
    {name: "PrimeNG", link: "https://primeng.org/"},
    {name: "Electron.js", link: "https://www.electronjs.org/"},
  ]
}
