import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../cart/services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent {
  cartService = inject(CartService);
  checkoutService = inject(CheckoutService);
  fb = inject(FormBuilder);
  router = inject(Router);

  checkoutForm: FormGroup;
  isProcessing = false;

  constructor() {
    this.checkoutForm = this.fb.group({
      recipientName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]{3,}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(01)[0125]\d{8}$/)]],
      deliveryAddress: ['', Validators.required],
      city: ['', Validators.required],
      deliveryNote: [''],
      paymentMethod: ['card', Validators.required],
      cardNumber: [''],
      cardExpiry: ['']
    });

    // Update validators based on payment method
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardControl = this.checkoutForm.get('cardNumber');
      const expiryControl = this.checkoutForm.get('cardExpiry');

      if (method === 'card') {
        cardControl?.setValidators([Validators.required]);
        expiryControl?.setValidators([Validators.required]);
      } else {
        cardControl?.clearValidators();
        expiryControl?.clearValidators();
      }
      cardControl?.updateValueAndValidity();
      expiryControl?.updateValueAndValidity();
    });
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    const formValue = this.checkoutForm.value;

    // Build the order object
    const order: Order = {
      recipientName: formValue.recipientName,
      phoneNumber: formValue.phoneNumber,
      deliveryAddress: formValue.deliveryAddress,
      city: formValue.city,
      deliveryNote: formValue.deliveryNote || '',
      paymentMethod: formValue.paymentMethod,
      items: this.cartService.cartItems(),
      subtotal: this.cartService.subtotal(),
      deliveryFee: this.cartService.deliveryFee(),
      total: this.cartService.total(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save order to the database first
    this.checkoutService.saveOrder(order).subscribe({
      next: (savedOrder) => {
        if (formValue.paymentMethod === 'card') {
          // Card payment → redirect to payment gateway page
          this.checkoutService.setPendingOrder(savedOrder);
          this.router.navigate(['/checkout/payment']);
        } else {
          // Cash on Delivery → redirect straight to WhatsApp
          const whatsappUrl = this.checkoutService.buildWhatsAppUrl(savedOrder);
          this.isProcessing = false;
          window.location.href = whatsappUrl;
        }
      },
      error: () => {
        this.isProcessing = false;
        alert('Something went wrong. Please try again.');
      }
    });
  }
}
