const BIGCOMMERCE_API_URL = import.meta.env.VITE_BIGCOMMERCE_API_URL || 'https://api.bigcommerce.com/stores/{store_hash}/v3';
const BIGCOMMERCE_TOKEN = import.meta.env.VITE_BIGCOMMERCE_TOKEN;

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

export async function getCartDetails(cartId: string): Promise<Cart> {
  if (!BIGCOMMERCE_TOKEN) {
    throw new Error('BigCommerce API token not configured. Please set VITE_BIGCOMMERCE_TOKEN in your environment variables.');
  }

  const res = await fetch(`${BIGCOMMERCE_API_URL}/carts/${cartId}`, {
    headers: {
      'X-Auth-Token': BIGCOMMERCE_TOKEN,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch cart: ${res.statusText}`);
  }
  
  const response = await res.json();
  return response.data;
}
