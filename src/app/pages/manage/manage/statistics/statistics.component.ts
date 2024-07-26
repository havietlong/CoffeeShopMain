import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [BaseChartDirective,NzButtonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  private token: string | null = null;

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels: string[] = [];
  public pieChartDatasets = [{
    data: []
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private http: HttpClient) {     
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }    

    this.getStatistics();
  }

  getStatistics(){
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    this.http.get<any[]>(`http://localhost:5265/api/products/reports`, { headers }).subscribe((data: any) => {
      console.log(data);
      const productNames = data.data.map((item: { productName: any; }) => item.productName);
      const productTotals = data.data.map((item: { total: any; }) => item.total);
      
      this.pieChartLabels = productNames;
      this.pieChartDatasets = [{
        data: productTotals
      }];
    });
  }

  downloadExcel(){
    
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    this.http.get<any[]>(`http://localhost:5265/api/products/export-to-excel`, { headers }).subscribe((data: any) => {
      console.log(data);     
    });
  }
}
