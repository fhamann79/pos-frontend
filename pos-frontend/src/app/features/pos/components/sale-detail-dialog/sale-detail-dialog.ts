import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SaleModel } from '../../models/sale.model';

@Component({
  selector: 'app-sale-detail-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TableModule, CurrencyPipe, DatePipe, TagModule],
  templateUrl: './sale-detail-dialog.html',
  styleUrl: './sale-detail-dialog.scss',
})
export class SaleDetailDialog {
  @Input() visible = false;
  @Input() sale: SaleModel | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
}
