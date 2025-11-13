import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import MerchantsTab from "@/components/merchant-admin/MerchantsTab";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const MerchantAdmin = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20">
                <Settings className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Reward AI Platform
                </h1>
                <p className="text-muted-foreground mt-1">
                  Configure your store settings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
              <div className="relative bg-background/60 backdrop-blur-xl rounded-full p-1 border border-white/20 shadow-lg">
                <UserButton
                  afterSignOutUrl="/sign-in"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonPopoverCard: "bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl",
                      userButtonPopoverActionButton: "hover:bg-gray-100 text-gray-900 transition-colors",
                      userButtonPopoverActionButtonText: "text-gray-900 font-medium",
                      userButtonPopoverActionButtonIcon: "text-primary",
                      userButtonPopoverFooter: "hidden",
                      userPreviewMainIdentifier: "text-gray-900 font-semibold",
                      userPreviewSecondaryIdentifier: "text-gray-600",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Store Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <MerchantsTab />
          </div>
        </motion.div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MerchantAdmin;
