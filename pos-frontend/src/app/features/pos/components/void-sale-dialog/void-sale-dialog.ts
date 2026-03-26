import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-void-sale-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, TextareaModule, ButtonModule],
  templateUrl: './void-sale-dialog.html',
  styleUrl: './void-sale-dialog.scss',
})
export class VoidSaleDialog {
  @Input() visible = false;
  @Input() submitting = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() submitVoid = new EventEmitter<string>();

  reason = '';

  onClose(): void {
    this.reason = '';
    this.visibleChange.emit(false);
  }

  onSubmit(): void {
    const normalized = this.reason.trim();
    if (!normalized) {
      return;
    }

    this.submitVoid.emit(normalized);
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.reason = '';
    }

    this.visibleChange.emit(visible);
  }
}
