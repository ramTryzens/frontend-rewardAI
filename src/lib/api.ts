// Backend API URL (local proxy server)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface CartItem {
  id: string;
  product_id: number;
  variant_id: number;
  name: string;
  quantity: number;
  list_price: number;
  sale_price: number;
  image_url?: string;
}

export interface Cart {
  id: string;
  customer_id?: number;
  email?: string;
  currency: {
    code: string;
  };
  cart_amount: number;
  line_items: {
    physical_items: CartItem[];
  };
}

export async function getCartDetails(cartId: string, platform?: string): Promise<Cart> {
  // Determine which endpoint to use based on platform
  const isMagento = platform && platform.toLowerCase() !== 'bigcommerce' && platform.toLowerCase() !== 'big commerce';
  const endpoint = isMagento
    ? `${API_BASE_URL}/magento/carts/${cartId}`
    : `${API_BASE_URL}/carts/${cartId}`;

  console.log(`🛒 Fetching cart from ${isMagento ? 'Magento (Adobe Commerce)' : 'BigCommerce'} via backend - Platform: ${platform}`);

  const res = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `Failed to fetch cart: ${res.statusText}`);
  }

  const response = await res.json();
  console.log("🚀 ~ getCartDetails ~ response:", response);
  return response.data;
}

// ========== Merchants API ==========

export interface Store {
  storeId?: string;
  storeName: string;
  platform: string;
  platformId?: string;
  storeDetails: Record<string, string>;
  businessRules: Record<string, boolean | number>;
  enabled?: boolean;
}

export interface Merchant {
  _id: string;
  userId: string;
  businessName: string;
  email: string;
  name?: string; // Keep for backward compatibility
  stores: Store[];
  createdAt: string;
  updatedAt: string;
}

export async function getMerchants(): Promise<Merchant[]> {
  const res = await fetch(`${API_BASE_URL}/merchants`);
  if (!res.ok) throw new Error('Failed to fetch merchants');
  const response = await res.json();
  console.log("🚀 ~ getMerchants ~ response:", response)
  return response.data;
}

export async function getMerchantByUserId(userId: string): Promise<Merchant> {
  const res = await fetch(`${API_BASE_URL}/merchants/by-user/${userId}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch merchant');
  }
  const response = await res.json();
  return response.data;
}

export async function createMerchant(data: Partial<Merchant>): Promise<Merchant> {
  const res = await fetch(`${API_BASE_URL}/merchants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create merchant');
  }
  const response = await res.json();
  return response.data;
}

export async function updateMerchant(id: string, data: Partial<Merchant>): Promise<Merchant> {
  const res = await fetch(`${API_BASE_URL}/merchants/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update merchant');
  }
  const response = await res.json();
  return response.data;
}

export async function deleteMerchant(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/merchants/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete merchant');
  }
}

// ========== Evaluate Smart Offers API ==========

export interface EvaluateRequest {
  customerId: string | number;
  cartId: string;
  merchantId?: string;
  storeId?: string;
  merchantEmail?: string;
  storeName?: string;
}

export interface SmartOffer {
  offerName?: string;
  discount?: string | number;
  description?: string;
  validUntil?: string;
  category?: string;
  minimumPurchase?: string | number;
  reward_type?: string;
  offer_type?: string;
  offer_value?: number | string;
  reasoning?: string;
  ai_bid?: number;
  aiBid?: number;
  AI_BID?: number;
  data?: string | Record<string, unknown>;
  Data?: string | Record<string, unknown>;
  [key: string]: unknown;
}

export async function evaluateSmartOffers(data: EvaluateRequest): Promise<SmartOffer[]> {
  const res = await fetch(`${API_BASE_URL}/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Failed to evaluate smart offers');
  }

  const response = await res.json();

  // Handle both array and object responses
  if (Array.isArray(response)) {
    return response;
  } else if (response.data) {
    return Array.isArray(response.data) ? response.data : [response.data];
  } else if (response && typeof response === 'object') {
    return [response];
  }

  return [];
}
