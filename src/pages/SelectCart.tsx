import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SelectCart = () => {
  const navigate = useNavigate();

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
          Choose a cart to view its details
        </motion.p>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Cart 1</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Info className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">Customer: John Doe</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/cart/1")}
                className="w-full"
              >
                View Cart
              </Button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Cart 2</h2>
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/cart/2")}
                className="w-full"
              >
                View Cart
              </Button>
            </div>
          </motion.div>
        </div>

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
