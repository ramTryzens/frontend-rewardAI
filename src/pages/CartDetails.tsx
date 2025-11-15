import { motion } from "framer-motion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCartDetails } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, DollarSign, User, ArrowLeft, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PromotionCards from "@/components/PromotionCards";
import Logo from "@/components/Logo";

const CartDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId") || "3"; // Default to 3 if not provided
  const merchantId = searchParams.get("merchantId") || "";
  const storeId = searchParams.get("storeId") || "";
  const platform = searchParams.get("platform") || "";

  const { data: cart, isLoading, error } = useQuery({
    queryKey: ["cart", id, platform],
    queryFn: () => getCartDetails(id!, platform),
    enabled: !!id,
  });

  // Log the merchant and store IDs for debugging
  console.log("Cart Details - Merchant ID:", merchantId, "Store ID:", storeId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl"
        >
          <Logo />
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Skeleton className="h-10 w-48 mb-6 bg-white/20" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full bg-white/20" />
              <Skeleton className="h-20 w-full bg-white/20" />
              <Skeleton className="h-20 w-full bg-white/20" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl text-center"
        >
          <Logo />
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Cart</h2>
            <p className="text-muted-foreground mb-6">
              {error instanceof Error ? error.message : "Failed to load cart details"}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Make sure to set your VITE_BIGCOMMERCE_TOKEN and VITE_BIGCOMMERCE_API_URL environment variables.
            </p>
            <Button variant="hero" onClick={() => navigate("/select-cart")}>
              Back to Cart Selection
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const items = cart?.line_items?.physical_items || [];
  const total = cart?.cart_amount || 0;
  const currency = cart?.currency?.code || "USD";

  return (
    <div className="min-h-screen bg-gradient-bg p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Logo />
        <Button
          variant="ghost"
          onClick={() => navigate("/select-cart")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart Selection
        </Button>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-primary p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-8 h-8 text-primary-foreground" />
              <h1 className="text-3xl font-bold text-primary-foreground">Cart Details</h1>
            </div>
            <p className="text-primary-foreground/80">Cart ID: {cart?.id}</p>
          </div>

          {/* Cart Info */}
          <div className="p-6 border-b border-white/10">
            <div className="grid md:grid-cols-2 gap-4">
              {cart?.email && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-white/10 p-3 rounded-xl">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="text-foreground font-medium">{cart.email}</p>
                  </div>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="bg-white/10 p-3 rounded-xl">
                  <DollarSign className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-foreground font-bold text-xl">
                    {currency} {total.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Items ({items.length})</h2>
            </div>

            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex gap-4">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border border-white/20"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Quantity: {item.quantity}</span>
                          <span>•</span>
                          <span className="text-foreground font-medium">
                            {currency} {item.sale_price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right self-center">
                        <p className="text-foreground font-bold">
                          {currency} {(item.sale_price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No items in this cart</p>
              </div>
            )}
          </div>
        </div>

        {/* Promotion Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Special Offers</h2>
          <PromotionCards
            cartId={cart?.id}
            customerId={customerId}
            cartTotal={total}
            merchantId={merchantId}
            storeId={storeId}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CartDetails;
