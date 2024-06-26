import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private tableNums: number[] = [];

  constructor() { }

  // Method to store table numbers
  storeTableNums(tableNums: number[]): void {
    this.tableNums = [...tableNums];
  }

  // Method to get the stored table numbers
  getTableNums(): number[] {
    return this.tableNums;
  }

  // Method to add a single table number
  storeUsedTable(tableNum: number): void {
    this.tableNums.push(tableNum);
  }

  // Method to remove a single table number
  removeUsedTable(tableNum: number): void {
    const index = this.tableNums.indexOf(tableNum);
    if (index > -1) {
      this.tableNums.splice(index, 1);
    }
  }
}
