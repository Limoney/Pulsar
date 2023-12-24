import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HammerModule, HammerGestureConfig } from '@angular/platform-browser';
import { DividerModule } from 'primeng/divider';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/match-braces/prism-match-braces';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import { ReuseStrategy } from './interfaces/reuse-strategy';
import { AlgorithmsPageModule } from './components/algorithms-page/algorithms-page.module';
import { HomePageModule } from './components/home-page/home-page.module';
// import 'prismjs/plugins/line-highlight/prism-line-highlight';

//https://stackblitz.com/github/sulco/angular-router-children-animation?file=src%2Fapp%2Fapp.module.ts

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ButtonModule,
		ProgressSpinnerModule,
		HammerModule,
		DividerModule,
		AlgorithmsPageModule,
		HomePageModule,
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: ReuseStrategy
		},
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
