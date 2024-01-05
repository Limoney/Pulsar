import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-background-waves',
  templateUrl: './background-waves.component.html',
  styleUrls: ['./background-waves.component.css']
})
export class BackgroundWavesComponent implements AfterViewInit {

  @ViewChild("wave1")
  protected wave1!: ElementRef;
  
  @ViewChild("wave2")
  protected wave2!: ElementRef;

  @ViewChild("wave3")
  protected wave3!: ElementRef;

  ngAfterViewInit(): void {
    gsap.to(this.wave1.nativeElement,{
      attr: { d: this.wave2.nativeElement.getAttribute("d") },
      duration: 7,
      yoyo: true,
      repeat: -1,
      ease: "power3.inOut",
      repeatDelay: 1
  })
  gsap.to(this.wave2.nativeElement,{
      attr: { d: this.wave3.nativeElement.getAttribute("d") },
      duration: 6,
      yoyo: true,
      repeat: -1,
      ease: "power4.inOut",
      repeatDelay: 1
  })
  gsap.to(this.wave3.nativeElement
    ,{
      attr: { d: this.wave1.nativeElement.getAttribute("d") },
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      repeatDelay: 1
  
  })
  }
}
