import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-payment-gateway-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-gateway-page.component.html',
  styleUrl: './payment-gateway-page.component.scss'
})
export class PaymentGatewayPageComponent implements OnInit {
  private checkoutService = inject(CheckoutService);
  private router = inject(Router);

  order: Order | null = null;
  stage = signal<'processing' | 'saving' | 'success' | 'failed'>('processing');
  progressPercent = signal(0);
  statusMessage = signal('Connecting to payment gateway...');

  ngOnInit(): void {
    this.order = this.checkoutService.getPendingOrder();

    if (!this.order) {
      this.router.navigate(['/checkout']);
      return;
    }

    this.runPaymentFlow();
  }

  private async runPaymentFlow(): Promise<void> {
    // --- Stage 1: Processing payment ---
    this.stage.set('processing');
    this.statusMessage.set('Connecting to payment gateway...');
    await this.animateProgress(0, 30, 800);

    this.statusMessage.set('Verifying card details...');
    await this.animateProgress(30, 50, 700);

    this.statusMessage.set('Processing payment...');

    // Actual payment API call
    this.checkoutService.processPayment(this.order!.id!, {
      cardNumber: '****',
      cardExpiry: '****'
    }).subscribe({
      next: (result) => {
        if (result.success) {
          this.onPaymentSuccess(result.transactionId);
        } else {
          this.onPaymentFailed();
        }
      },
      error: () => {
        this.onPaymentFailed();
      }
    });
  }

  private async onPaymentSuccess(transactionId: string): Promise<void> {
    await this.animateProgress(50, 70, 600);

    // --- Stage 2: Saving to database ---
    this.stage.set('saving');
    this.statusMessage.set('Payment successful! Saving to database...');
    await this.animateProgress(70, 85, 500);

    // Update order status to 'done' in the database
    this.checkoutService.updateOrderStatus(this.order!.id!, 'done').subscribe({
      next: () => {
        this.onDatabaseSaved(transactionId);
      },
      error: () => {
        // Even if DB update fails, still redirect (payment was taken)
        this.onDatabaseSaved(transactionId);
      }
    });
  }

  private async onDatabaseSaved(transactionId: string): Promise<void> {
    await this.animateProgress(85, 100, 400);

    this.stage.set('success');
    this.statusMessage.set('Order confirmed! Redirecting to WhatsApp...');

    // Mark order as done locally
    this.order!.status = 'done';

    // Short pause so the user sees the success screen
    await this.delay(1500);

    // Clean up and redirect to WhatsApp
    const whatsappUrl = this.checkoutService.buildWhatsAppUrl(this.order!);
    this.checkoutService.clearPendingOrder();
    window.location.href = whatsappUrl;
  }

  private onPaymentFailed(): void {
    this.stage.set('failed');
    this.progressPercent.set(0);
    this.statusMessage.set('Payment failed. Please try again.');
  }

  retryPayment(): void {
    this.progressPercent.set(0);
    this.runPaymentFlow();
  }

  goBack(): void {
    this.checkoutService.clearPendingOrder();
    this.router.navigate(['/checkout']);
  }

  // --- Helpers ---

  private animateProgress(from: number, to: number, durationMs: number): Promise<void> {
    return new Promise(resolve => {
      const steps = to - from;
      const interval = durationMs / steps;
      let current = from;
      const timer = setInterval(() => {
        current++;
        this.progressPercent.set(current);
        if (current >= to) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
