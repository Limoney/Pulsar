import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CreditsComponent } from './components/home-page/credits/credits.component';
import { AlgorithmListComponent } from './components/home-page/algorithm-list/algorithm-list.component';
import { AlgorithmsPageComponent } from './components/algorithms-page/algorithms-page.component';
import { AlgorithmComponent } from './components/algorithms-page/algorithm/algorithm.component';

const routes: Routes = [
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
		data: { animation: 'algorithms' },
		children: [
			{
				path: ':name', 
				component: AlgorithmComponent,
				data: { animation: 'algorithm' },
			},
		]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
