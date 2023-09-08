import * as p5 from "p5";
import { P5Service } from "src/app/services/p5.service";

export class Camera
{
    public position: p5.Vector;
    public minSpeed: number;
    public maxSpeed: number;
    public lastPointerPosition: p5.Vector;
    public zoomLevel: number;
    public zoomSpeed: number;
    private sketchRef: p5;
    private isMoving: boolean;

    constructor(center = null)
    {
        //width/2,height/2
        this.sketchRef = new P5Service().getP5Instance();
        if(center)
            this.position = this.sketchRef.createVector(center);
        else
            this.position = this.sketchRef.createVector(0,0);
        this.minSpeed = 1;
        this.maxSpeed = 1000;
        this.zoomLevel = 1;
        this.zoomSpeed = 0.05;
        this.isMoving = false;
        this.lastPointerPosition = this.sketchRef.createVector(0,0);
    }

    update()
    {
        this.sketchRef.translate(this.position.x,this.position.y);
        this.sketchRef.scale(this.zoomLevel);
    }

    zoom(direction: number)
    {
        let mouse = this.sketchRef.createVector(this.sketchRef.mouseX, this.sketchRef.mouseY);
        this.zoomAtPoint(mouse,direction)
    }
    
    zoomAtPoint(point: p5.Vector ,direction: number)
    {
        this.zoomLevel *= direction;
        this.position.sub(point).mult(direction).add(point)
    }

    onMove(pointerX: number, pointerY: number)
    {
        let direction = this.sketchRef.createVector(pointerX,pointerY).sub(this.lastPointerPosition);
        this.position.add(direction)
        this.lastPointerPosition = this.sketchRef.createVector(pointerX,pointerY);
    }

    onMoveStart(pointerX: number,pointerY: number)
    {
        this.isMoving = true;
        this.lastPointerPosition = this.sketchRef.createVector(pointerX,pointerY)
    }

    onMoveEnd(pointerX: number,pointerY: number)
    {
        this.isMoving = false;
        this.lastPointerPosition = this.sketchRef.createVector(pointerX,pointerY)
    }

    reset()
    {
        this.zoomLevel = 1;
        this.position = this.sketchRef.createVector();
    }
    
}