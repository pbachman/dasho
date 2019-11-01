import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SettingPage } from './setting/setting';
import { TilePage } from './tile/tile';
import { TileService } from './tile/tile.service';
import { AdminRoutingModule } from './admin-routing.module.ts';
import { CoreModule } from 'src/app/core/core.module';
import { SettingService } from './setting/setting.service';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule
  ],
  declarations: [SettingPage, TilePage],
  providers: [
    SettingService,
    TileService
  ]
})
export class AdminModule {}
