import {gsap} from "gsap";
import * as p5 from "p5";

export interface Animatable
{
    update(): void;

    show(): void;

    mark(color: string): Promise<void>;

    unmark(disableAnimation?: boolean): Promise<void>;

    flash(color:string): void;

    setPositionWithIndex(indexInArray: number, timeline?: gsap.core.Timeline): void;

    getBoundingBox(): {position: p5.Vector, size: p5.Vector};

    setValue(value: number): void;
    
    valueOf(): number;
}
