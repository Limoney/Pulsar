import * as p5 from 'p5';
export class ABC
{
    private sketch!: p5;

    constructor() {}

    // The setup method for initializing your canvas
    setup() {
        this.sketch.createCanvas(400, 400);
        this.sketch.background(220);
    }

    // The draw method for continuous drawing
    draw() {
        this.sketch.fill(255, 0, 0);
        this.sketch.ellipse(this.sketch.width / 2, this.sketch.height / 2, 100, 100);
    }

    // Create the p5 instance and set it up
    create() {
        
        // this.p5.setup = this.setup.bind(this);
        // this.p5.draw = this.draw.bind(this);
        return new p5((s) => {

        })
    }
}