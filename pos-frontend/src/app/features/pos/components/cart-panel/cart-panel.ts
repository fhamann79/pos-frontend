import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { CartItemModel } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, TableModule, InputNumberModule, TextareaModule, ButtonModule],
  templateUrl: './cart-panel.html',
  styleUrl: './cart-panel.scss',
})
export class CartPanel {
  @Input({ required: true }) items: CartItemModel[] = [];
  @Input() notes = '';
  @Input() canCheckout = false;
  @Input() submitting = false;

  @Output() quantityChange = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() priceChange = new EventEmitter<{ productId: number; unitPrice: number }>();
  @Output() removeItem = new EventEmitter<number>();
  @Output() notesChange = new EventEmitter<string>();
  @Output() checkout = new EventEmitter<void>();

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.lineSubtotal, 0);
  }

  get total(): number {
    return this.subtotal;
  }

  onQuantityChange(productId: number, value: number | null | undefined): void {
    this.quantityChange.emit({ productId, quantity: value ?? 1 });
  }

  onPriceChange(productId: number, value: number | null | undefined): void {
    this.priceChange.emit({ productId, unitPrice: value ?? 0 });
  }
}
