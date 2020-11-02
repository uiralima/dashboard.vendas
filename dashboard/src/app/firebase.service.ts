import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DailySale, Sale } from '../../../common/models/sale.models';


@Injectable()
export class FirebaseService {

    private salesCollection: AngularFirestoreCollection<DailySale>;

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

    public getOldDocuments(): Observable<DailySale[]> {
        return this.salesCollection.get().pipe(
            map(docs => {
                let result: DailySale[] = [];
                docs.docs.forEach((doc) => {
                    let sale = new DailySale();
                    sale.date = doc.id;
                    sale.sales = <Sale[]>doc.data().sales;
                    result.push(sale);
                });
                return result;
            })
        );
    }
}