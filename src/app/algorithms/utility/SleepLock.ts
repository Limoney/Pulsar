export class SleepLock
{
    private isLocked: boolean;
    private sleepDuration: number
    constructor(sleepDuration: number)
    {
        this.isLocked = false;
        this.sleepDuration = sleepDuration;
    }

    public lock()
    {
        this.isLocked = true;
    }

    public unlock()
    {
        this.isLocked = false;
    }

    public setSleepDuration(durationSeconds: number)
    {
        this.sleepDuration = durationSeconds;
    }

    public static sleep(getLock: () => SleepLock ): Promise<void> {
        return new Promise<void>(resolve => {
            if (getLock().isLocked) 
            {
                const checkLock = () => {
                    if (!getLock().isLocked) 
                    {
                        resolve();
                    } 
                    else 
                    {
                        window.setTimeout(checkLock, 100); 
                    }
                };
                checkLock();
            } 
            else 
            {
                window.setTimeout(resolve, getLock().sleepDuration);
            }
            });
      }
}