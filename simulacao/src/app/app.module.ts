import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfigInfo } from '../../../common/config/firebase.config';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from './firestore.service';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		AngularFireModule.initializeApp(firebaseConfigInfo)
	],
	providers: [
		FirestoreService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
