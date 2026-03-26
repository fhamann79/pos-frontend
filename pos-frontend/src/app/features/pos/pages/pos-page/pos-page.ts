import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { PERMISSIONS } from '../../../../core/constants/permissions';
import { PermissionService } from '../../../../core/services/permission.service';
import { CartPanel } from '../../components/cart-panel/cart-panel';
import { ProductBrowser } from '../../components/product-browser/product-browser';
import { SaleDetailDialog } from '../../components/sale-detail-dialog/sale-detail-dialog';
import { SalesHistory } from '../../components/sales-history/sales-history';
import { VoidSaleDialog } from '../../components/void-sale-dialog/void-sale-dialog';
import { QuickProductSearchDialog } from '../../components/quick-product-search-dialog/quick-product-search-dialog';
import { CartItemModel } from '../../models/cart-item.model';
import { PosProductModel } from '../../models/pos-product.model';
import { SaleListItemModel } from '../../models/sale-list-item.model';
import { SaleModel } from '../../models/sale.model';
import { PosProductService } from '../../services/pos-product.service';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-pos-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    MessageModule,
    ProductBrowser,
    CartPanel,
    SalesHistory,
    SaleDetailDialog,
    VoidSaleDialog,
    QuickProductSearchDialog,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './pos-page.html',
  styleUrl: './pos-page.scss',
})
export class PosPage implements OnInit {
  private readonly permissionService = inject(PermissionService);
  private readonly posProductService = inject(PosProductService);
  private readonly salesService = inject(SalesService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly canCreateSales = computed(() => this.permissionService.hasPermission(PERMISSIONS.posSalesCreate));
  readonly canReadSales = computed(() => this.permissionService.hasPermission(PERMISSIONS.reportsSalesRead));
  readonly canVoidSales = computed(() => this.permissionService.hasPermission(PERMISSIONS.posSalesVoid));

  readonly products = signal<PosProductModel[]>([]);
  readonly sales = signal<SaleListItemModel[]>([]);
  readonly cartItems = signal<CartItemModel[]>([]);
  readonly searchTerm = signal('');
  readonly notes = signal('');

  readonly productsLoading = signal(false);
  readonly salesLoading = signal(false);
  readonly submitSaleLoading = signal(false);
  readonly voidSaleLoading = signal(false);

  readonly productsError = signal('');
  readonly salesError = signal('');

  readonly detailDialogVisible = signal(false);
  readonly selectedSale = signal<SaleModel | null>(null);

  readonly voidDialogVisible = signal(false);
  readonly saleIdToVoid = signal<number | null>(null);
  readonly quickSearchVisible = signal(false);

  readonly filteredProducts = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const items = this.products();

    if (!search) {
      return items;
    }

    return items.filter((product) => product.name.toLowerCase().includes(search));
  });

  ngOnInit(): void {
    this.loadProducts();

    if (this.canReadSales()) {
      this.loadSales();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleShortcuts(event: KeyboardEvent): void {
    if (event.key === 'F2' && this.canCreateSales()) {
      event.preventDefault();
      this.quickSearchVisible.set(true);
    }
  }

  loadProducts(): void {
    this.productsLoading.set(true);
    this.productsError.set('');

    this.posProductService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.productsLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.productsLoading.set(false);
        this.productsError.set(this.resolveErrorMessage(error, 'No se pudieron cargar los productos.'));
      },
    });
  }

  loadSales(): void {
    this.salesLoading.set(true);
    this.salesError.set('');

    this.salesService.getSales().subscribe({
      next: (sales) => {
        this.sales.set(sales);
        this.salesLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.salesLoading.set(false);
        this.salesError.set(this.resolveErrorMessage(error, 'No se pudieron cargar las ventas recientes.'));
      },
    });
  }

  addToCart(product: PosProductModel): void {
    if (!this.canCreateSales()) {
      return;
    }

    this.cartItems.update((current) => {
      const index = current.findIndex((item) => item.productId === product.productId);

      if (index >= 0) {
        const updated = [...current];
        const existing = updated[index];
        const quantity = existing.quantity + 1;
        updated[index] = { ...existing, quantity, lineSubtotal: quantity * existing.unitPrice };
        return updated;
      }

      return [
        ...current,
        {
          productId: product.productId,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          lineSubtotal: product.price,
        },
      ];
    });
  }

  addFirstFilteredProduct(): void {
    const firstProduct = this.filteredProducts()[0];
    if (firstProduct) {
      this.addToCart(firstProduct);
    }
  }

  onQuantityChange(event: { productId: number; quantity: number }): void {
    const quantity = Math.max(1, Math.floor(event.quantity || 1));

    this.cartItems.update((items) =>
      items.map((item) =>
        item.productId === event.productId ? { ...item, quantity, lineSubtotal: quantity * item.unitPrice } : item
      )
    );
  }

  onPriceChange(event: { productId: number; unitPrice: number }): void {
    const unitPrice = Math.max(0, Number(event.unitPrice || 0));

    this.cartItems.update((items) =>
      items.map((item) =>
        item.productId === event.productId ? { ...item, unitPrice, lineSubtotal: item.quantity * unitPrice } : item
      )
    );
  }

  removeItem(productId: number): void {
    this.cartItems.update((items) => items.filter((item) => item.productId !== productId));
  }

  checkout(): void {
    if (!this.canCreateSales() || this.cartItems().length === 0 || this.submitSaleLoading()) {
      return;
    }

    this.confirmationService.confirm({
      header: 'Finalizar venta',
      message: '¿Deseas confirmar la venta actual?',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => this.createSale(),
    });
  }

  createSale(): void {
    const sanitizedItems = this.cartItems().map((item) => ({
      productId: item.productId,
      quantity: Math.max(1, Math.floor(item.quantity)),
      unitPrice: Math.max(0, Number(item.unitPrice)),
    }));

    this.submitSaleLoading.set(true);

    this.salesService
      .createSale({
        notes: this.notes().trim() || undefined,
        items: sanitizedItems,
      })
      .subscribe({
        next: () => {
          this.submitSaleLoading.set(false);
          this.messageService.add({ severity: 'success', summary: 'Venta creada', detail: 'La venta se registró correctamente.' });
          this.cartItems.set([]);
          this.notes.set('');
          this.loadProducts();
          if (this.canReadSales()) {
            this.loadSales();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.submitSaleLoading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo finalizar la venta',
            detail: this.resolveErrorMessage(error),
          });
        },
      });
  }

  openDetail(saleId: number): void {
    this.detailDialogVisible.set(true);
    this.selectedSale.set(null);

    this.salesService.getSaleById(saleId).subscribe({
      next: (sale) => {
        this.selectedSale.set(sale);
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo cargar el detalle',
          detail: this.resolveErrorMessage(error),
        });
      },
    });
  }

  requestVoid(saleId: number): void {
    if (!this.canVoidSales()) {
      return;
    }

    this.saleIdToVoid.set(saleId);
    this.voidDialogVisible.set(true);
  }

  confirmVoid(reason: string): void {
    const saleId = this.saleIdToVoid();
    if (!saleId || this.voidSaleLoading()) {
      return;
    }

    this.voidSaleLoading.set(true);
    this.salesService.voidSale(saleId, { reason }).subscribe({
      next: () => {
        this.voidSaleLoading.set(false);
        this.onVoidDialogVisibleChange(false);
        this.messageService.add({ severity: 'success', summary: 'Venta anulada', detail: 'La venta fue anulada con éxito.' });
        if (this.canReadSales()) {
          this.loadSales();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.voidSaleLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo anular la venta',
          detail: this.resolveErrorMessage(error),
        });
      },
    });
  }

  onVoidDialogVisibleChange(visible: boolean): void {
    this.voidDialogVisible.set(visible);
    if (!visible) {
      this.saleIdToVoid.set(null);
    }
  }

  private resolveErrorMessage(error: HttpErrorResponse, fallback = 'Ocurrió un error inesperado.'): string {
    const backendCode = this.extractBackendCode(error);

    if (backendCode === 'INSUFFICIENT_STOCK') {
      return 'Stock insuficiente para completar la venta.';
    }

    if (backendCode === 'SALE_ALREADY_VOIDED') {
      return 'La venta ya fue anulada previamente.';
    }

    if (backendCode === 'SALE_NOT_FOUND') {
      return 'La venta no existe o ya no está disponible.';
    }

    if (backendCode === 'PRODUCT_NOT_FOUND') {
      return 'Uno de los productos seleccionados ya no existe.';
    }

    if (backendCode === 'INVALID_SALE_ITEMS') {
      return 'La venta contiene ítems inválidos. Revisa cantidades y precios.';
    }

    if (error.status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    }

    if (typeof error.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }

    return fallback;
  }

  private extractBackendCode(error: HttpErrorResponse): string {
    if (typeof error.error === 'string') {
      return error.error;
    }

    if (typeof error.error?.code === 'string') {
      return error.error.code;
    }

    if (typeof error.error?.errorCode === 'string') {
      return error.error.errorCode;
    }

    if (typeof error.error?.message === 'string') {
      return error.error.message;
    }

    if (Array.isArray(error.error?.errors) && typeof error.error.errors[0]?.code === 'string') {
      return error.error.errors[0].code;
    }

    return '';
  }
}
