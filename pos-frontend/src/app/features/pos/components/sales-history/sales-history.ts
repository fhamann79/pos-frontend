import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SaleListItemModel } from '../../models/sale-list-item.model';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CurrencyPipe, DatePipe, TagModule, MessageModule],
  templateUrl: './sales-history.html',
  styleUrl: './sales-history.scss',
})
export class SalesHistory {
  @Input({ required: true }) sales: SaleListItemModel[] = [];
  @Input() loading = false;
  @Input() errorMessage = '';
  @Input() canVoid = false;

  @Output() viewDetail = new EventEmitter<number>();
  @Output() voidSale = new EventEmitter<number>();

  canVoidSale(status: string): boolean {
    return this.canVoid && status.toUpperCase() !== 'VOIDED';
  }
}
