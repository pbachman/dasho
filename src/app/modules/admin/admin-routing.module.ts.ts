import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SettingPage } from './setting/setting';
import { TilePage } from './tile/tile';

const routes: Routes = [
  {
    path: 'setting',
    component: SettingPage
  },
  {
    path: 'tile',
    component: TilePage
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
