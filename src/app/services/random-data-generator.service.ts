import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class RandomDataGeneratorService {

	constructor() {

    }

	getRandomData(amount: number, min:number, max:number)
	{
		return Array.from(Array(amount), () => Math.floor(Math.random() * (max - min + 1)) + min)
	}

	getSortedData (amount: number, min:number, max:number)
	{
		let data = new Array(amount)
		let increment = (max - min) / amount;
		let newMax = min + increment;
		let newMin = min;

		for (let i = 0; i < amount; i++) {
			const value = Math.floor(Math.random() * (newMax - newMin + 1)) + newMin
			data[i] = value;
			newMin = value;
			newMax = value + increment + 1;
		}
		return data;
	}
}
