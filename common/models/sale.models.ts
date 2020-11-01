import { Product } from "./products.models";

export class Sale {
    constructor() {
        this.finalPrice = 0;
        this.deliveryTax = 0;
    }

    public id: string;
    public finalPrice: number;
    public deliveryTax: number;
    public products: Product[] = [];
    public saleDate: Date;
} 

export class DailySale {
    public date: string;
    public sales: Sale[];
}