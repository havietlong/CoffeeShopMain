import { Component } from '@angular/core';
import { ReceiptService } from '../../../../services/receipt/receipt.service';
import { TableDisplayComponent } from "../../../../components/table-display/table-display.component";

@Component({
    selector: 'app-manage-receipts',
    standalone: true,
    templateUrl: './manage-receipts.component.html',
    styleUrl: './manage-receipts.component.scss',
    imports: [TableDisplayComponent]
})
export class ManageReceiptsComponent {
  columns: string[] = ['Name', 'Products in use']; // Update columns for employees
  data: any[] = [];
  // categories: Category[] = [];
  

  constructor(private receiptsServices:ReceiptService) {
    this.receiptsServices.getReceipts().subscribe(
      res => {
        if(res){
          this.data = res;
        }
      }
    );
  }

  createCategories(){
    
  }
}
