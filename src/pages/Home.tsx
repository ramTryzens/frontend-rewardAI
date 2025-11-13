import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-bg p-4 md:p-8 flex flex-col">
      <div className="max-w-4xl mx-auto flex-grow flex flex-col justify-center items-center text-center">
        {/* Logo */}
        <Logo />

        {/* Hero Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-8 md:p-12 mb-8">
          <div className="bg-gradient-primary rounded-full p-4 w-fit mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">Reward AI</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            AI-powered cart management and intelligent customer rewards
          </p>

          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate("/select-cart")}
            className="font-semibold"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;