import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Sale } from '../../../common/models/sale.models';

@Injectable()
export class FirebaseService {

    private salesCollection: AngularFirestoreCollection<Sale>;

    constructor(protected myFirestone: AngularFirestore) {
        this.salesCollection = this.myFirestone.collection("sales");
    }

    public ObserveSales(): Observable<Sale[]> {
        let date = new Date();
        let key = date.getFullYear().toString() + 
            (((date.getMonth() + 1) >= 10) ? 
                (date.getMonth() + 1) : "0" + (date.getMonth() + 1)).toString() +
                ((date.getDate() >= 10) ? date.getDate() : "0" + (date.getDate())).toString();
        return this.salesCollection.doc<Sale[]>(key).valueChanges();
    }
}