import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardService } from './services/dashboard.service';
import { LanguageService } from './services/language.service';
import { UserService } from './services/user.service';
import { LoginService } from './services/login.service';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forRoot(),
  ],
  exports: [
    MenuComponent
  ],
  declarations: [
    MenuComponent
  ],
  providers: [
    DashboardService,
    LanguageService,
    UserService,
    LoginService
  ],
})
export class CoreModule { }
