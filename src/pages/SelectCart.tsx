import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Info, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SelectCart = () => {
  const navigate = useNavigate();
  const [customCartId, setCustomCartId] = useState("");
  const [customerId, setCustomerId] = useState("");

  const handleViewCart = () => {
    if (customCartId.trim()) {
      const customerIdParam = customerId.trim() || "3"; // Default to 3 if not provided
      navigate(`/cart/${customCartId.trim()}?customerId=${customerIdParam}`);
    } else {
      alert("Please enter a valid Cart ID");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center"
        >
          Select a Cart
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-muted-foreground text-center mb-12"
        >
          Enter your cart ID to view its details and get personalized AI offers
        </motion.p>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-primary p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Enter Cart ID</h2>
                <p className="text-sm text-muted-foreground">View your cart and get AI-powered offers</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="cartId" className="text-sm font-medium text-foreground mb-2 block">
                  Cart ID <span className="text-red-400">*</span>
                </label>
                <Input
                  id="cartId"
                  type="text"
                  placeholder="e.g., 50656685-567c-42c9-9a1e-9389e9f76b68"
                  value={customCartId}
                  onChange={(e) => setCustomCartId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleViewCart()}
                  className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="customerId" className="text-sm font-medium text-foreground mb-2 block">
                  Customer ID <span className="text-muted-foreground text-xs">(Optional - defaults to 3)</span>
                </label>
                <Input
                  id="customerId"
                  type="text"
                  placeholder="e.g., 3"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleViewCart()}
                  className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <Button
                variant="hero"
                size="lg"
                onClick={handleViewCart}
                disabled={!customCartId.trim()}
                className="w-full"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Cart
              </Button>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-muted-foreground mb-2">Quick Example:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCustomCartId("50656685-567c-42c9-9a1e-9389e9f76b68");
                    setCustomerId("3");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground w-full"
                >
                  Use example cart ID & customer ID
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SelectCart;
