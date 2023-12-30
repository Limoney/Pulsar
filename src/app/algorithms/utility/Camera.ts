import * as p5 from "p5";
import { P5Service } from "src/app/services/p5.service";

export class Camera
{
    public position: p5.Vector;
    public lastPointerPosition: p5.Vector;
    public zoomLevel: number = 1;
    public zoomSpeed: number = 0.05;
    private sketchRef: p5;

    constructor(position = null)
    {
        //width/2,height/2
        this.sketchRef = P5Service.getP5Instance();
        
        if(position)
        {
            this.position = this.sketchRef.createVector(position);
        }
        else
        {
            this.position = this.sketchRef.createVector(0,0);
        }
        this.zoomLevel = 1;
        this.zoomSpeed = 0.05;
        this.lastPointerPosition = this.sketchRef.createVector(0,0);
    }

    update()
    {
        // this.sketchRef.ellipse(this.sketchRef.width/2,this.sketchRef.height/2,120);
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
        this.lastPointerPosition = this.sketchRef.createVector(pointerX,pointerY)
    }

    onMoveEnd(pointerX: number,pointerY: number)
    {
        this.lastPointerPosition = this.sketchRef.createVector(pointerX,pointerY)
    }

    reset()
    {
        this.zoomLevel = 1;
        this.position = this.sketchRef.createVector();
    }

    isOnScreen(centerX: number,centerY: number,w: number, h:number)
    {
        return ((centerX + w/2) * this.zoomLevel + this.position.x >= 0 &&
                (centerX - w/2) * this.zoomLevel + this.position.x <= this.sketchRef.width &&

                (centerY + h/2) * this.zoomLevel + this.position.y >= 0 &&
                (centerY - h/2) * this.zoomLevel + this.position.y <= this.sketchRef.height)
    }

}