import { CommonModule, CurrencyPipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PosProductModel } from '../../models/pos-product.model';

@Component({
  selector: 'app-quick-product-search-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule, ButtonModule, TableModule, TagModule, CurrencyPipe],
  templateUrl: './quick-product-search-dialog.html',
  styleUrl: './quick-product-search-dialog.scss',
})
export class QuickProductSearchDialog implements AfterViewChecked {
  @Input() visible = false;
  @Input() products: PosProductModel[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() selectProduct = new EventEmitter<PosProductModel>();

  @ViewChild('quickSearchInput') quickSearchInput?: ElementRef<HTMLInputElement>;

  query = '';
  private focusPending = false;

  get filteredProducts(): PosProductModel[] {
    const normalized = this.query.trim().toLowerCase();

    if (!normalized) {
      return this.products;
    }

    return this.products.filter((product) => product.name.toLowerCase().includes(normalized));
  }

  ngAfterViewChecked(): void {
    if (this.visible && this.focusPending && this.quickSearchInput?.nativeElement) {
      this.quickSearchInput.nativeElement.focus();
      this.quickSearchInput.nativeElement.select();
      this.focusPending = false;
    }
  }

  onVisibleChange(visible: boolean): void {
    if (visible) {
      this.focusPending = true;
      return;
    }

    this.query = '';
    this.visibleChange.emit(false);
  }

  onSelect(product: PosProductModel): void {
    this.selectProduct.emit(product);
    this.query = '';
    this.visibleChange.emit(false);
  }

  onEnter(): void {
    const firstProduct = this.filteredProducts[0];
    if (firstProduct) {
      this.onSelect(firstProduct);
    }
  }
}
