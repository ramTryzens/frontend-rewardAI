import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCartDetails } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, DollarSign, User, ArrowLeft, AlertCircle, Bot, Laptop, LineChart, Gift, Database, Search, Sparkles, MapPin, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PromotionCards from "@/components/PromotionCards";
import Logo from "@/components/Logo";
import DemoBadge from "@/components/DemoBadge";
import { useState, useEffect } from "react";

const CartDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId") || "3"; // Default to 3 if not provided
  const merchantId = searchParams.get("merchantId") || "";
  const storeId = searchParams.get("storeId") || "";
  const platform = searchParams.get("platform") || "";
  const merchantEmail = decodeURIComponent(searchParams.get("merchantEmail") || "");
  const [isN8nLoading, setIsN8nLoading] = useState(true);

  // Helper function to format address object into readable string
  const formatAddress = (address: any) => {
    if (!address) return "";
    const parts = [
      address.address1,
      address.address2,
      address.city,
      address.state_or_province,
      address.postal_code,
      address.country
    ].filter(Boolean);
    return parts.join(", ");
  };

  const { data: cart, isLoading, error } = useQuery({
    queryKey: ["cart", id, platform],
    queryFn: () => getCartDetails(id!, platform, customerId),
    enabled: !!id,
  });

  // Log the parameters for debugging
  console.log("🛒 Cart Details Parameters:", {
    merchantId,
    merchantEmail,
    storeId,
    platform,
    customerId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <DemoBadge />
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <Logo />
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl"
          >
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <DemoBadge />
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <Logo />
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl text-center"
          >
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
      </div>
    );
  }

  const items = cart?.line_items?.physical_items || [];
  const total = cart?.cart_amount || 0;
  const currency = cart?.currency?.code || "USD";

  return (
    <div className="min-h-screen bg-gradient-bg">
      <DemoBadge />
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <Logo />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 pb-12"
      >
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

          {/* Account Details */}
          {(cart?.numberOfOrders !== undefined || cart?.mainAddress) && (
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-foreground" />
                <h2 className="text-xl font-semibold text-foreground">Account Details</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {cart?.numberOfOrders !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-white/10 p-3 rounded-xl">
                      <FileText className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Number of Orders</p>
                      <p className="text-foreground font-bold text-xl">{cart.numberOfOrders}</p>
                    </div>
                  </motion.div>
                )}
                {cart?.mainAddress && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-white/10 p-3 rounded-xl">
                      <MapPin className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-foreground font-medium">{formatAddress(cart.mainAddress)}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

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

          {/* AI Agents Loading Section - Shows while n8n is loading */}
          {isN8nLoading && <AIAgentsLoadingSection />}

          <PromotionCards
            cartId={cart?.id}
            customerId={customerId}
            cartTotal={total}
            merchantId={merchantId}
            storeId={storeId}
            merchantEmail={merchantEmail}
            onLoadingChange={setIsN8nLoading}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

// AI Agents Loading Section Component
const AIAgentsLoadingSection = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    "Initializing your reward journey... Awakening the digital neurons 🧠",
    "Reading database records... Spelunking through data caverns 🗄️",
    "Determining platform specifics... Detecting your e-commerce ecosystem 🌐",
    "Connecting to API endpoints... Handshaking with remote servers 🤝",
    "Accumulating customer data... Gathering insights from the vault 💎",
    "Passing details to AI Agent... Summoning the n8n oracle for wisdom ✨",
    "Processing complex rule sets... Crunching numbers at light speed ⚡",
    "Analyzing optimal combinations... Finding hidden gems in the offer matrix 🎯",
    "Preparing personalized results... Polishing your exclusive rewards 🎁",
    "Delivering best offers to you... Excellence arriving at your cart! 🚀",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [messages.length]);

  const agents = [
    { icon: Bot, color: "from-purple-500 to-pink-500" },
    { icon: Laptop, color: "from-blue-500 to-cyan-500" },
    { icon: LineChart, color: "from-orange-500 to-yellow-500" },
    { icon: Gift, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
      <div className="relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 backdrop-blur-md rounded-xl border border-white/20 p-6 overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Scanning line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent h-20"
          animate={{
            y: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="relative z-10">
          {/* AI Agents Row */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center justify-center gap-4 mb-3">
              {agents.map((agent, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Agent Avatar with scanning effect */}
                  <motion.div
                    className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${agent.color} p-0.5`}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(147, 51, 234, 0)",
                        "0 0 0 8px rgba(147, 51, 234, 0)",
                        "0 0 0 0 rgba(147, 51, 234, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                      <agent.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Scanning ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/50"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.8, 0, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                        ease: "easeOut",
                      }}
                    />

                    {/* Active indicator */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Unified Agent Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <span className="text-sm text-primary font-semibold">
                n8n Workflow Execution in Progress
              </span>
            </motion.div>
          </div>

          {/* Scanning status indicators */}
          <div className="flex items-center justify-center gap-2 mb-4 mt-8">
            <Database className="w-4 h-4 text-primary animate-pulse" />
            <motion.div
              className="h-0.5 w-16 bg-gradient-to-r from-primary via-purple-500 to-transparent rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            <Search className="w-4 h-4 text-purple-500 animate-pulse" />
            <motion.div
              className="h-0.5 w-16 bg-gradient-to-r from-purple-500 via-blue-500 to-transparent rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.3,
              }}
            />
            <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
          </div>

          {/* Message Content */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                n8n Agents Active
              </span>
            </div>

            {/* Dynamic Messages */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-foreground font-medium text-lg mb-4"
              >
                {messages[currentMessageIndex]}
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-purple-500 to-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Particle Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: `${10 + i * 12}%`,
                  top: "30%",
                  background: `linear-gradient(135deg, ${
                    i % 4 === 0 ? '#9333ea' : i % 4 === 1 ? '#3b82f6' : i % 4 === 2 ? '#ec4899' : '#06b6d4'
                  }, transparent)`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartDetails;
