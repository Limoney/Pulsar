import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PrismService {

	private linesSubject = new BehaviorSubject<string>("");
	private lines = this.linesSubject.asObservable();

	constructor() { }

	public getHighlightedLines(): Observable<string> {
		return this.lines;
	}


	public highlightLines(lines: string): void {
		this.linesSubject.next(lines);
	}
}
