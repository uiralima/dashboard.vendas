import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { DailySale, Sale } from '../../../common/models/sale.models';
import { FirebaseService } from './firebase.service';
import { map } from 'rxjs/operators';
import { Product } from '../../../common/models/products.models';

class LastSalesCard {
	public header: string = "Ultimas vendas hoje";
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

class OldSaleCardInfo {
	public day: string;
	public unformatedDay: string;
	public total: number;
	public totalValue: number;
}

class OldSaleCard {
	public header: string = "Vendas por dia";
	public infos: OldSaleCardInfo[] = [];
}

class ProductCard {
	public header: string = "Mais vendidos hoje";
	public infos: ProducstsCardInfo[] = [];
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	public sales: Sale[] = [];

	public dailySale: OldSaleCard = new OldSaleCard();

	public productCard: ProductCard = new ProductCard();
	public lastSalesCard: LastSalesCard = new LastSalesCard()

	constructor(protected firestoneService: FirebaseService) {

	}

	private putProductInProductCard(product: Product) {
		let item = this.productCard.infos.find((my) => my.id === product.id);
		if (item) {
			item.amount += product.amount;
			item.totalValue += product.price * product.amount;
		}
		else {
			this.productCard.infos.push(new ProducstsCardInfo(product.id, product.fullname, product.amount, product.price * product.amount))
		}
	}

	public ngOnInit(): void {
		let today = new Date();
		let todayKey = today.getFullYear().toString() +
			(((today.getMonth() + 1) >= 10) ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1)).toString() +
			((today.getDate() >= 10) ? today.getDate() : "0" + (today.getDate())).toString();
		this.firestoneService.getOldDocuments().subscribe((data: DailySale[]) => {
			data.forEach((info: DailySale) => {
				let dayInfo = new OldSaleCardInfo();
				if (info.date != todayKey) {
					dayInfo.day = `${info.date.substr(6,2)}/${info.date.substr(4,2)}/${info.date.substr(0,4)}`;
					dayInfo.unformatedDay = info.date;
					let totalValue = info.sales.reduce((value, item) => item.finalPrice, 0)
					dayInfo.total = info.sales.length;
					dayInfo.totalValue = totalValue;
					this.dailySale.infos.push(dayInfo);
				}
			})
			this.dailySale.infos = this.dailySale.infos.sort((a, b) => (+b.unformatedDay) - (+a.unformatedDay));
		});
		let todayInfo: OldSaleCardInfo = new OldSaleCardInfo();
		todayInfo.day = `${todayKey.substr(6,2)}/${todayKey.substr(4,2)}/${todayKey.substr(0,4)}`;
		todayInfo.unformatedDay = todayKey;
		this.dailySale.infos.push(todayInfo);
		this.firestoneService.ObserveSales().pipe(
			map((data: any) => {
				if (data) {
					todayInfo.total = data.sales.length;
					todayInfo.totalValue = 0;
					let sales = data.sales;
					this.productCard = new ProductCard();
					sales.forEach((sale: Sale) => {
						todayInfo.totalValue += sale.finalPrice;
						// Acerta a data da venda
						sale.saleDate = (<any>sale.saleDate).toDate();
						// Organiza os dados do cartão de produtos
						sale.products.map((product: Product) => {
							this.putProductInProductCard(product);
						})
					})
					this.productCard.infos = this.productCard.infos.sort((a, b) => b.amount - a.amount)
					let result = sales.sort((a, b) => (+b.saleDate) - (+a.saleDate));
					this.dailySale.infos = this.dailySale.infos.sort((a, b) => (+b.unformatedDay) - (+a.unformatedDay));
					this.lastSalesCard = new LastSalesCard();
					this.lastSalesCard.lastSales = result.slice(0, 3);
					return result;
				}
				else {
					return this.sales;
				}
			})
		).subscribe((sales: Sale[]) => {
			this.sales = sales;
		});
	}
}