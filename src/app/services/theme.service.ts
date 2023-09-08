import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  public getPrimaryColors()
  {
    const styles = getComputedStyle(document.body);
    let PRIMARY_COLOR = styles.getPropertyValue("--primary");
    let PRIMARY_DARK_COLOR = styles.getPropertyValue("--primary-dark");
    return {
      primary: PRIMARY_COLOR,
      dark: PRIMARY_DARK_COLOR
    }
  }
}
