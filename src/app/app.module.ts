import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { IonicStorageModule } from '@ionic/storage-angular';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(), MenuComponent],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({ projectId: "epp-sys", appId: "1:74203027225:web:9b1e666be7837044c1d788", storageBucket: "epp-sys.firebasestorage.app", apiKey: "AIzaSyDebcwquWGQSwl5nTSL4SntKOozrbzTCPo", authDomain: "epp-sys.firebaseapp.com", messagingSenderId: "74203027225", measurementId: "G-1EFWR32SXB" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())],
  bootstrap: [AppComponent],
})
export class AppModule {}
