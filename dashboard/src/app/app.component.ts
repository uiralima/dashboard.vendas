import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { Sale } from '../../../common/models/sale.models';
import { FirebaseService } from './firebase.service';
import { map } from 'rxjs/operators';
import { Product } from '../../../common/models/products.models';

class LastSalesCard {
	public header: string = "Ultimas vendas realizadas";
	public lastSales: Sale[] = [];
}

class ProducstsCardInfo {
	constructor(
		public id: string,
		public fullname: string,
		public amount: number,
		public totalValue: number) {

	}
}

class ProductCard {
	public header: string = "Produtos mais vendidos";
	public infos: ProducstsCardInfo[] = [];
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	public sales: Sale[] = [];

	public productCard: ProductCard = new ProductCard();
	public lastSalesCard: LastSalesCard = new LastSalesCard()

	constructor(protected firestoneService: FirebaseService) {

	}

	private putProductInProductCard(product: Product) {
		let isInProductCard: boolean = false;
		for (let i = 0; i < this.productCard.infos.length; i++) {
			if (this.productCard.infos[i].id === product.id) {
				this.productCard.infos[i].amount += product.amount;
				this.productCard.infos[i].totalValue += product.price * product.amount;
				isInProductCard = true;
				break;
			}
		}
		if (!isInProductCard) {
			this.productCard.infos.push(new ProducstsCardInfo(product.id, product.fullname, product.amount, product.price * product.amount))
		}
	}

	public ngOnInit(): void {
		this.firestoneService.ObserveSales().pipe(
			map((data: any) => {
				let sales = data.sales;
				console.log(sales);
				this.productCard = new ProductCard();
				sales.map((sale: Sale) => {
					// Acerta a data da venda
					sale.saleDate = (<any>sale.saleDate).toDate()//aux;
					// Organiza os dados do cartão de produtos
					sale.products.map((product: Product) => {
						this.putProductInProductCard(product);
					})
				})
				this.productCard.infos = this.productCard.infos.sort((a, b) => b.amount - a.amount)
				let result = sales.sort((a, b) => (+b.saleDate) - (+a.saleDate));
				this.lastSalesCard = new LastSalesCard();
				this.lastSalesCard.lastSales = result.slice(0, 3);

				return result;
			}
			)
		).subscribe((sales: Sale[]) => {
			console.log(sales);
			this.sales = sales;
		})
	}
}
