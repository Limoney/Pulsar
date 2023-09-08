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
import { AlgorithmsPageComponent } from './components/algorithms-page/algorithms-page.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { VisualizationPanelComponent } from './components/algorithms-page/visualization-panel/visualization-panel.component';
import { SortingUiPanelComponent } from './components/algorithms-page/sorting-ui-panel/sorting-ui-panel.component';
import { SearchingUiPanelComponent } from './components/algorithms-page/searching-ui-panel/searching-ui-panel.component';
import { SplitterModule } from 'primeng/splitter';
import { HammerModule, HammerGestureConfig } from '@angular/platform-browser';


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
		component: AlgorithmsPageComponent, 
		data: { animation: "algorithms" },
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
  		AlgorithmsPageComponent,
		VisualizationPanelComponent,
		SortingUiPanelComponent,
		SearchingUiPanelComponent,
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
		TagModule,
		ProgressSpinnerModule,
		SplitterModule,
		HammerModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
