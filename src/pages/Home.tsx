import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ShoppingCart, LogIn, UserPlus } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 inline-block"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20">
            <ShoppingCart className="w-16 h-16 text-foreground" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
        >
          Welcome to a demo of {" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Reward AI
          </span>{" "}
          in action
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mb-10"
        >
          View and manage your customer carts with elegance and simplicity
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {isLoaded && isSignedIn ? (
            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="font-semibold"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/sign-in")}
                className="font-semibold"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/sign-up")}
                className="font-semibold bg-white/5 border-white/20 hover:bg-white/10"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up
              </Button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;