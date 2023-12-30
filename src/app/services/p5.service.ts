import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { Observable,BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class P5Service {

	private static instance: p5;

	static getP5Instance() {
		if(!P5Service.instance)
		{
			P5Service.instance = new p5(() => {});
		}
		return P5Service.instance;
	}
}
