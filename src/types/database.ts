export type UserRole = 'customer' | 'admin';

export interface Category {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface ProductSpecifications {
  weight?: string;
  dimensions?: string;
  color?: string;
  handleType?: string;
}

export interface Product {
  id: string;
  name: string;
  name_en: string | null;
  collection: string;
  category: string | null;
  price: number;
  price_usd: number;
  images: string[];
  description: string | null;
  description_en: string | null;
  long_description: string | null;
  description_images: string[];
  sold_count?: number;
  material: string | null;
  specifications: ProductSpecifications;
  bestseller: boolean;
  premium: boolean;
  in_stock: boolean;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank-transfer';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  payment_method: PaymentMethod;
  notes: string | null;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  voucher_code: string | null;
  payment_proof_url: string | null;
  total: number;
  created_at: string;
  updated_at: string;
}

export type VoucherType = 'percentage' | 'fixed' | 'shipping';

// Public-safe preview of a currently-usable voucher — no id/used_count/
// timestamps, only what's meant to be shown to a shopper.
export interface ActiveVoucherPreview {
  code: string;
  type: VoucherType;
  value: number;
  min_order_value: number;
  description: string | null;
}

export interface Voucher {
  id: string;
  code: string;
  type: VoucherType;
  value: number;
  min_order_value: number;
  max_uses: number;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 'new_order' | 'order_status_changed' | 'new_message';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  order_id: string | null;
  conversation_id: string | null;
  read_at: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

export type SenderRole = 'customer' | 'admin';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: SenderRole;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}
