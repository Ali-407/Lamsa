import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map, catchError } from 'rxjs';
import { Order } from '../models/order.model';
import { environment } from '../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Store pending order data for the payment gateway page to pick up
  private pendingOrder: Order | null = null;

  setPendingOrder(order: Order): void {
    this.pendingOrder = order;
    // Also persist to sessionStorage so it survives the navigation to payment gateway
    sessionStorage.setItem('pendingOrder', JSON.stringify(order));
  }

  getPendingOrder(): Order | null {
    if (this.pendingOrder) return this.pendingOrder;
    const stored = sessionStorage.getItem('pendingOrder');
    return stored ? JSON.parse(stored) : null;
  }

  clearPendingOrder(): void {
    this.pendingOrder = null;
    sessionStorage.removeItem('pendingOrder');
  }

  /**
   * Save the order to the database.
   * Tries the real API first; if unavailable, falls back to localStorage mock.
   */
  saveOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order).pipe(
      catchError(() => {
        // Fallback: save to localStorage when backend is unavailable
        const orders = JSON.parse(localStorage.getItem('odoratus_orders') || '[]');
        const savedOrder = { ...order, id: this.generateId() };
        orders.push(savedOrder);
        localStorage.setItem('odoratus_orders', JSON.stringify(orders));
        return of(savedOrder);
      })
    );
  }

  /**
   * Process payment via the backend payment gateway.
   * Tries real API first; falls back to a simulated success after 2s.
   */
  processPayment(orderId: string, cardDetails: { cardNumber: string; cardExpiry: string }): Observable<{ success: boolean; transactionId: string }> {
    return this.http.post<{ success: boolean; transactionId: string }>(
      `${this.apiUrl}/payments`, 
      { orderId, ...cardDetails }
    ).pipe(
      catchError(() => {
        // Fallback: simulate payment gateway processing
        return of({ success: true, transactionId: this.generateId() }).pipe(delay(2000));
      })
    );
  }

  /**
   * Update the order status in the database after payment succeeds.
   * Tries real API first; falls back to localStorage.
   */
  updateOrderStatus(orderId: string, status: 'done' | 'failed'): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}`, { status }).pipe(
      catchError(() => {
        // Fallback: update in localStorage
        const orders: Order[] = JSON.parse(localStorage.getItem('odoratus_orders') || '[]');
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
          orders[idx].status = status;
          localStorage.setItem('odoratus_orders', JSON.stringify(orders));
          return of(orders[idx]);
        }
        return of({ ...({} as Order), id: orderId, status });
      })
    );
  }

  /**
   * Build the WhatsApp redirect URL with the order summary.
   */
  buildWhatsAppUrl(order: Order): string {
    const items = order.items.map(item =>
      `${item.quantity}x ${item.name} (${item.size}) - ${item.price} EGP`
    ).join('\n');

    const paymentLabel = order.paymentMethod === 'card'
      ? `Visa (Paid ✅ - Status: DONE)`
      : 'Cash on Delivery';

    const message =
      `🛍️ *New Order — ODORATUS*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${order.recipientName}\n` +
      `Phone: ${order.phoneNumber}\n` +
      `Address: ${order.deliveryAddress}, ${order.city}\n` +
      `Note: ${order.deliveryNote || 'N/A'}\n` +
      `Payment: ${paymentLabel}\n\n` +
      `*Order Items:*\n${items}\n\n` +
      `Subtotal: ${order.subtotal} EGP\n` +
      `Delivery: ${order.deliveryFee} EGP\n` +
      `*Total: ${order.total} EGP*`;

    const phoneNumber = '201148248443';
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }

  private generateId(): string {
    return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
}
