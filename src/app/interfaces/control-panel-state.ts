export interface ControlPanelState {

    readonly dataInputEnabled: boolean;

    readonly utilityEnabled: boolean;

    readonly playEnabled: boolean;

    readonly nextStepEnabled: boolean;

    readonly pauseEnabled: boolean;

    readonly resumeEnabled: boolean;

    //speed, restart and step by step toggle are always enabled
}

export class ControlPanelIdleState implements ControlPanelState {
    
    public dataInputEnabled: boolean = true;

    public utilityEnabled: boolean = true;

    public playEnabled: boolean = true;

    public nextStepEnabled: boolean = false;

    public pauseEnabled: boolean = false;

    public resumeEnabled: boolean = false;

}

export class ControlPanelAutoState implements ControlPanelState{

    public dataInputEnabled: boolean = false;

    public utilityEnabled: boolean = false;

    public playEnabled: boolean = false;

    public nextStepEnabled: boolean = false;

    public pauseEnabled: boolean = true;

    public resumeEnabled: boolean = false;
}

export class ControlPanelManualState implements ControlPanelState {

    public dataInputEnabled: boolean = false;

    public utilityEnabled: boolean = false;

    public playEnabled: boolean = false;

    public nextStepEnabled: boolean = true;

    public pauseEnabled: boolean = false;

    public resumeEnabled: boolean = true;
}