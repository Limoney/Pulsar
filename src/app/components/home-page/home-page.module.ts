import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BackgroundWavesComponent } from './background-waves/background-waves.component';
import { CreditsComponent } from './credits/credits.component';
import { AlgorithmListComponent } from './algorithm-list/algorithm-list.component';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HomePageComponent,
		NavbarComponent,
		BackgroundWavesComponent,
		CreditsComponent,
		AlgorithmListComponent,
  ],
  imports: [
    CommonModule,
    PanelModule,
    TableModule,
    DataViewModule,
    TagModule,
    RouterModule
  ],
  exports: [
    HomePageComponent,
		NavbarComponent,
		BackgroundWavesComponent,
		CreditsComponent,
		AlgorithmListComponent,
  ]
})
export class HomePageModule { }
