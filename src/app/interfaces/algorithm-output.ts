export class AlgorithmOutput {
	constructor(public executiontime: Date,
				public returnValue: any,
				public exitMessage: string) {

	}

	getFormatedExecutionTime()
	{
		const hours = this.executiontime.getUTCHours().toString().padStart(2, '0');
		const minutes = this.executiontime.getUTCMinutes().toString().padStart(2, '0');
		const seconds = this.executiontime.getUTCSeconds().toString().padStart(2, '0');
		const milliseconds = this.executiontime.getUTCMilliseconds().toString().padStart(3, '0');

		return `${hours}:${minutes}:${seconds}.${milliseconds}`;
	}

}