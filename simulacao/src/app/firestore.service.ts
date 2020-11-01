import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Product } from '../../../common/models/products.models';
import { from, Observable } from 'rxjs';
import { Sale } from '../../../common/models/sale.models';

@Injectable()
export class FirestoreService {
    private productsCollection: AngularFirestoreCollection<Product>;
    private salesCollection: AngularFirestoreCollection<Sale>;
    constructor(protected firestore: AngularFirestore) {
        this.productsCollection = this.firestore.collection("products");
        this.salesCollection = this.firestore.collection("sales");
    }

    

    public addProduct(name: string, price: number): Observable<void> {
        let product: Product = new Product();
        product.id = this.firestore.createId();
        product.fullname = name;
        product.price = price;
        return from (this.productsCollection.doc(product.id).set({...product}));
    }

    /*public saveSale(sale: Sale): Observable<void> {
        sale.id = this.firestore.createId();
        sale.saleDate = new Date();
        return from(this.salesCollection.doc(sale.id).set({...sale}))
    }*/

    public saveSale(sale: Sale): Observable<void> {
        sale.id = this.firestore.createId();
        sale.saleDate = new Date();
        let key = sale.saleDate.getFullYear().toString() + 
            (((sale.saleDate.getMonth() + 1) >= 10) ? 
                (sale.saleDate.getMonth() + 1) : "0" + (sale.saleDate.getMonth() + 1)).toString() +
                ((sale.saleDate.getDate() >= 10) ? sale.saleDate.getDate() : "0" + (sale.saleDate.getDate())).toString();
        return from(this.salesCollection.doc(key).update({
            sales: firebase.default.firestore.FieldValue.arrayUnion({...sale})
        }).catch(() => {
            this.salesCollection.doc(key).set({sales: [{...sale}]})
        }))
    }

    public observeProduct(): Observable<Product[]> {
        return this.productsCollection.valueChanges();
    } 
}