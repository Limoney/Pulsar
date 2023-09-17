export class Timer
{
    private elapsedTime: number = 0;
    private startingTimestamp: number = 0;

    constructor()
    {
        this.continue();
    }

    pause()
    {
        this.elapsedTime += Date.now() - this.startingTimestamp;
    }

    continue()
    {
        this.startingTimestamp = Date.now();
    }

    getElapsedTime()
    {
        this.pause();
        return this.elapsedTime;
    }
}