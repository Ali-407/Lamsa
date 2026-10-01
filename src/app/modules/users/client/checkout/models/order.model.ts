import { CartItem } from '../../cart/models/cart-item.model';

export interface Order {
  id?: string;
  recipientName: string;
  phoneNumber: string;
  deliveryAddress: string;
  city: string;
  deliveryNote: string;
  paymentMethod: 'card' | 'cash';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'processing' | 'done' | 'failed';
  createdAt: string;
}
