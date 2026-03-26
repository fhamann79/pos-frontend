import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PosProductModel } from '../../models/pos-product.model';

@Component({
  selector: 'app-product-browser',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, TableModule, InputTextModule, ButtonModule, TagModule, MessageModule],
  templateUrl: './product-browser.html',
  styleUrl: './product-browser.scss',
})
export class ProductBrowser {
  @Input({ required: true }) products: PosProductModel[] = [];
  @Input() loading = false;
  @Input() errorMessage = '';
  @Input() canCreate = false;

  @Input() searchTerm = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() addProduct = new EventEmitter<PosProductModel>();

  onSearchChange(term: string): void {
    this.searchTermChange.emit(term);
  }

  onAddProduct(product: PosProductModel): void {
    if (!this.canCreate) {
      return;
    }

    this.addProduct.emit(product);
  }
}
