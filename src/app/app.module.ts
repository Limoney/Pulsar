import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavbarComponent } from './components/home-page/navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { BackgroundWavesComponent } from './components/home-page/background-waves/background-waves.component';
import { CreditsComponent } from './components/home-page/credits/credits.component';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { AlgorithmListComponent } from './components/home-page/algorithm-list/algorithm-list.component';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { AlgorithmsComponent } from './components/algorithms/algorithms.component';

const appRoutes: Routes = [
	{
		path: '', 
		component: HomePageComponent, 
		data: { animation: 'homepage' },
		children: [
			{ 
				path: 'credits', 
				component: CreditsComponent, 
				data: { animation: 'credits' } 
			},
			{ 
				path: 'algorithm-list', 
				component: AlgorithmListComponent, 
				data: { animation: 'algorithm-list' } 
			}
		]
	},
	{ 
		path: 'algorithms', 
		component: AlgorithmsComponent, 
		data: { animation: "algorithms" }
	}
]

@NgModule({
	declarations: [
		AppComponent,
		HomePageComponent,
		NavbarComponent,
		BackgroundWavesComponent,
		CreditsComponent,
		AlgorithmListComponent,
		AlgorithmsComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' }),
		ButtonModule,
		PanelModule,
		TableModule,
		DataViewModule,
		TagModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
