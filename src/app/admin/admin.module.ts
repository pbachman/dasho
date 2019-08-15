import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SettingPage } from './setting/setting';
import { TilePage } from './tile/tile';
import { TileService } from './tile/tile.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: 'setting',
        component: SettingPage
      },
      {
        path: 'tile',
        component: TilePage
      }
    ])
  ],
  declarations: [SettingPage, TilePage],
  providers: [
    TileService,
    Location
  ]
})
export class AdminPageModule {}
