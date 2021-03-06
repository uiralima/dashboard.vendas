import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../common/models/products.models';
import { Sale } from '../../../common/models/sale.models';
import { FirestoreService } from './firestore.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'simulacao';

	public sale: Sale = new Sale();
	public selectedProduct: Product = new Product();
	public products: Product[] = []

	public productForm: FormGroup = new FormGroup({
		productName: new FormControl('', [Validators.required, Validators.minLength(2)]),
		productPrice: new FormControl('', [Validators.required, Validators.min(0)])
	});

	constructor(private firestoreService: FirestoreService) {

	}
	ngOnInit(): void {
		this.firestoreService.observeProduct().subscribe((products: Product[]) => {
			this.products = products;
		})
	}

	public addProduct(): void {
		if (this.productForm.valid) {
			this.firestoreService.addProduct(this.productForm.value.productName, this.productForm.value.productPrice)
				.subscribe(() => {
				})
		}
	}

	public addProductInSale(): void {
		if (this.selectedProduct.amount <= 0) {
			this.selectedProduct.amount = 1;
		}
		this.sale.products.push(this.selectedProduct);
		this.calculateSalePrice();
		
		this.selectedProduct = new Product();
	}

	public calculateSalePrice(): void {
		this.sale.finalPrice = this.sale.deliveryTax;
		this.sale.products.forEach((item) => {
			this.sale.finalPrice += item.price * item.amount;
		})
	}

	public saveSale(): void {
		this.calculateSalePrice();
		this.firestoreService.saveSale(this.sale).subscribe(() => {
			this.sale = new Sale();
		});
	}
}
