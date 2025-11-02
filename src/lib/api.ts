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

export async function getCartDetails(cartId: string): Promise<Cart> {
  const res = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
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
