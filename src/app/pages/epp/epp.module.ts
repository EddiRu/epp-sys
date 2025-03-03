import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EppPageRoutingModule } from './epp-routing.module';

import { EppPage } from './epp.page';
import { MenuComponent } from 'src/app/components/menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EppPageRoutingModule
  ],
  declarations: [EppPage]
})
export class EppPageModule {}
