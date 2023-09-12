import { gsap } from "gsap";
import * as p5 from "p5";
import { P5Service } from "src/app/services/p5.service";

export class Bar
{
    private width: number;
    public fillColor: string;
    public strokeColor: string;
    public strokeSize: number = 1;
    public position: p5.Vector; //TODO: make me private
    public value: number;
    private sketch: p5;
    static defaultFillColor = "#eeeeee";
    static defaultStrokeColor = "#a9a9a9";
    static animationDuration = 1;

    constructor(x: number,y: number,w: number,v: number)
    {
        // debugger;
        this.sketch = new P5Service().getP5Instance();
        this.position = this.sketch.createVector(x,y)
        this.width = w;
        this.value = v;
        this.fillColor = Bar.defaultFillColor;
        this.strokeColor = Bar.defaultStrokeColor;
    }

    update()
    {
        this.position.y = this.sketch.height;
    }
    // TODO: p5 as a service
    // ok but how do you inject?
    // nvm not service
    show()
    {
        this.sketch.fill(this.fillColor);
        this.sketch.stroke(this.strokeColor);
        this.sketch.rect(this.position.x,this.position.y,this.width,-this.value);

        this.sketch.fill(255);
        this.sketch.noStroke();
        this.sketch.text(this.value,this.position.x + this.width*0.5,this.sketch.height-this.value);
    }

    mark(color: string)
    {        
        gsap.to(this,{
            fillColor: color,
            strokeColor: color,
            ease: "power2.inOut",
            duration: Bar.animationDuration
        })
    }

    unmark()
    {
        gsap.to(this,{
            fillColor: Bar.defaultFillColor,
            strokeColor: Bar.defaultStrokeColor,
            ease: "power2.inOut",
            duration: Bar.animationDuration
        })
    }

    fastUnmark()
    {
        this.fillColor = Bar.defaultFillColor;
        this.strokeColor = Bar.defaultStrokeColor;
    }

    flash(color:string )
    {
        gsap.to(this,{
            fillColor: color,
            strokeColor: color,
            ease: "power2.inOut",
            duration: Bar.animationDuration,
            repeat: 1,
            yoyo: true
        })
    }

    valueOf() 
    {
        return this.value;
    }

    static compare(left: Bar,right: Bar)
    {
        if (left.value < right.value) 
            return -1;
        else if (left.value > right.value) 
            return 1;
        else 
            return 0;
    }
      
    [Symbol.for('@@equals')](other: Bar) 
    {
        return this.value === other.value;
    }
    
    [Symbol.for('@@lessThan')](other: Bar) 
    {
        return this.value < other.value;
    }

    [Symbol.for('@@moreThan')](other: Bar) 
    {
        return this.value < other.value;
    }
}