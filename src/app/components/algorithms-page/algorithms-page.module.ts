import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { StyleClassModule } from 'primeng/styleclass';
import { SpeedDialModule } from 'primeng/speeddial';
import { BlockUIModule } from 'primeng/blockui';
import { AlgorithmsPageComponent } from './algorithms-page.component';
import { VisualizationPanelComponent } from './visualization-panel/visualization-panel.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { AlgorithmComponent } from './algorithm/algorithm.component';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { KnobModule } from 'primeng/knob';
import { SplitterModule } from 'primeng/splitter';


@NgModule({
  declarations: [
    AlgorithmsPageComponent,
		VisualizationPanelComponent,
		ControlPanelComponent,
    AlgorithmComponent,
  ],
  imports: [
    CommonModule,
    StyleClassModule,
		SpeedDialModule,
		BlockUIModule,
    DropdownModule,
    PanelModule,
    FormsModule,
    InputNumberModule,
    InputSwitchModule,
    KnobModule,
    SplitterModule,
  ],
  exports: [
    AlgorithmsPageComponent,
		VisualizationPanelComponent,
		ControlPanelComponent,
    AlgorithmComponent,
  ]
})
export class AlgorithmsPageModule { }
