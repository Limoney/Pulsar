import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {

	private styles: CSSStyleDeclaration;

	constructor() {
		this.styles = getComputedStyle(document.body);
	}

	public getColor(variableName: string) {
		return this.styles.getPropertyValue("--" + variableName);
	}
}
