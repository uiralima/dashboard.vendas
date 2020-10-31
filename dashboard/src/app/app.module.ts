import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { firebaseConfigInfo } from '../../../common/config/firebase.config';

import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfigInfo)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
