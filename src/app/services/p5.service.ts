import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { Observable,BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class P5Service {

	private static instance: p5;
	private readySubject = new BehaviorSubject(false);

	constructor() {
		
		if(!P5Service.instance)
		{
			P5Service.instance = new p5((sketch) => {
				sketch.setup = () => {
					console.log("p5 created");
					
					this.readySubject.next(true);
				};
				sketch.draw = () => {
					// sketch.background(240, 240, 240);
				};
			})
		}
	}

	ready(): Observable<boolean>
	{
		return this.readySubject.asObservable()
	}

	getP5Instance() {
		return P5Service.instance;
	}


	// setParent(id: string) {
	// 	if (P5Service.canvasRef) {

	// 	}
	// }

	// deleteInstance() {
	// 	P5Service.instance.remove();
	// }
}
