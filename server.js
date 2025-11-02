import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// BigCommerce API configuration
const BIGCOMMERCE_API_URL = process.env.BIGCOMMERCE_API_URL;
const BIGCOMMERCE_TOKEN = process.env.BIGCOMMERCE_TOKEN;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Proxy endpoint for cart details
app.get('/api/carts/:cartId', async (req, res) => {
  const { cartId } = req.params;

  if (!BIGCOMMERCE_TOKEN) {
    return res.status(500).json({
      error: 'BigCommerce API token not configured. Please set BIGCOMMERCE_TOKEN in your environment variables.'
    });
  }

  try {
    const response = await fetch(`${BIGCOMMERCE_API_URL}/carts/${cartId}`, {
      headers: {
        'X-Auth-Token': BIGCOMMERCE_TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('BigCommerce API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Failed to fetch cart: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📦 BigCommerce API URL: ${BIGCOMMERCE_API_URL}`);
  console.log(`🔑 Token configured: ${BIGCOMMERCE_TOKEN ? 'Yes' : 'No'}`);
});
