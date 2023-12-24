import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {

	private styles: CSSStyleDeclaration;

	public readonly palette = [
        "#e74c3cff",
        "#e67e22ff",
        "#f1c40fff",
        "#2ecc71ff",
        "#3498dbff",
        "#9b59b6ff"
    ]

	constructor() {
		this.styles = getComputedStyle(document.body);
	}

	public getColor(variableName: string) {
		return this.styles.getPropertyValue("--" + variableName);
	}
}
