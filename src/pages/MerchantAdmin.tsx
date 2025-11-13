import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Loader2 } from "lucide-react";
import MerchantsTab from "@/components/merchant-admin/MerchantsTab";
import EcommerceTab from "@/components/merchant-admin/EcommerceTab";
import RulesTab from "@/components/merchant-admin/RulesTab";

const MerchantAdmin = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("merchants");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded || !user) return;

      try {
        const response = await fetch(`http://localhost:3001/api/users/${user.id}`);

        if (response.ok) {
          const dbUser = await response.json();
          setIsAdmin(dbUser.isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, isLoaded]);

  if (loading || !isLoaded) {
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
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage merchants, platforms, and business rules
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Home
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-white/5 border-b border-white/10 rounded-none p-0">
              <TabsTrigger
                value="merchants"
                className="flex-1 md:flex-none data-[state=active]:bg-white/10 data-[state=active]:text-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Merchants
              </TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger
                    value="ecommerce"
                    className="flex-1 md:flex-none data-[state=active]:bg-white/10 data-[state=active]:text-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Ecommerce Platforms
                  </TabsTrigger>
                  <TabsTrigger
                    value="rules"
                    className="flex-1 md:flex-none data-[state=active]:bg-white/10 data-[state=active]:text-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Business Rules
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <div className="p-6">
              <TabsContent value="merchants" className="mt-0">
                <MerchantsTab />
              </TabsContent>

              {isAdmin && (
                <>
                  <TabsContent value="ecommerce" className="mt-0">
                    <EcommerceTab />
                  </TabsContent>

                  <TabsContent value="rules" className="mt-0">
                    <RulesTab />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default MerchantAdmin;
