import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-bg p-4 md:p-8 flex flex-col">
      <div className="max-w-4xl mx-auto flex-grow flex flex-col">
        {/* Logo */}
        <Logo />

        {/* Header */}
        <div className="flex justify-end mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent border-0 shadow-none",
                    headerTitle: "text-2xl font-bold text-foreground",
                    headerSubtitle: "text-muted-foreground",
                    formButtonPrimary: "bg-primary hover:bg-primary/90 transition-colors duration-300",
                    footerActionLink: "text-primary hover:text-primary/80 transition-colors",
                    formFieldInput: "bg-white/5 border-white/10 focus:border-primary/50 transition-colors text-foreground",
                    formFieldLabel: "text-foreground",
                    dividerLine: "bg-white/10",
                    dividerText: "text-muted-foreground",
                    socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 transition-colors text-foreground",
                    socialButtonsBlockButtonText: "text-foreground",
                    identityPreviewText: "text-foreground",
                    identityPreviewEditButton: "text-primary hover:text-primary/80",
                    formResendCodeLink: "text-primary hover:text-primary/80",
                    otpCodeFieldInput: "text-foreground",
                    footerActionText: "text-muted-foreground",
                  },
                }}
                routing="virtual"
                signInUrl="/sign-in"
                redirectUrl="/dashboard"
              />
            </div>
          </div>
        </motion.div>

        {/* Promotional Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6 text-sm text-muted-foreground mb-auto"
        >
          Join thousands of merchants using AI-powered solutions
        </motion.p>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default SignUpPage;
