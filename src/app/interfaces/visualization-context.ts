import { VisualizationAction } from "../enums/visualization-action";

export class VisualizationContext
{
    constructor(public action: VisualizationAction,
                public data?: any)
    {

    }
}