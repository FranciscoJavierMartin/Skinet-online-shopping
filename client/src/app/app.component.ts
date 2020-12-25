import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './interfaces/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}
  products: IProduct[];

  ngOnInit() {
    this.http.get('https://localhost:5001/api/products?pageSize=30').subscribe(
      (response: IPagination) => {
        this.products = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
