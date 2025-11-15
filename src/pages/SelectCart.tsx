import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronRight, ChevronLeft, Store as StoreIcon, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { getMerchants, Merchant, Store } from "@/lib/api";

const SelectCart = () => {
  const navigate = useNavigate();
  const [customCartId, setCustomCartId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // 0: merchants, 1: stores, 2: cart
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [currentMerchantIndex, setCurrentMerchantIndex] = useState(0);
  const [currentStoreIndex, setCurrentStoreIndex] = useState(0);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setLoading(true);
        const data = await getMerchants();
        setMerchants(data);
        console.log("Fetched merchants:", data);
      } catch (error) {
        console.error("Failed to fetch merchants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  // Reset selected store and store index when merchant changes
  useEffect(() => {
    setSelectedStore(null);
    setCurrentStoreIndex(0);
  }, [selectedMerchant]);

  const handleViewCart = () => {
    if (customCartId.trim()) {
      const customerIdParam = customerId.trim() || "3"; // Default to 3 if not provided
      const merchantIdParam = selectedMerchant?._id || "";
      const storeIdParam = selectedStore?.storeId || "";
      const platformParam = selectedStore?.platform || "";
      const merchantEmailParam = encodeURIComponent(selectedMerchant?.email || "");

      // Debug logging
      console.log("🔍 Navigation Parameters:", {
        merchantId: merchantIdParam,
        merchantEmail: selectedMerchant?.email,
        storeId: storeIdParam,
        selectedMerchant,
        selectedStore
      });

      navigate(`/cart/${customCartId.trim()}?customerId=${customerIdParam}&merchantId=${merchantIdParam}&storeId=${storeIdParam}&platform=${platformParam}&merchantEmail=${merchantEmailParam}`);
    } else {
      alert("Please enter a valid Cart ID");
    }
  };

  const handleNextFromMerchants = () => {
    if (selectedMerchant) {
      setCurrentStep(1);
    } else {
      alert("Please select a merchant to continue");
    }
  };

  const handleNextFromStores = () => {
    if (selectedStore) {
      setCurrentStep(2);
    } else {
      alert("Please select a store to continue");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 1) {
        setSelectedStore(null);
      }
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        <Logo />

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-2 w-16 rounded-full transition-all ${currentStep >= 0 ? 'bg-primary' : 'bg-white/20'}`} />
          <div className={`h-2 w-16 rounded-full transition-all ${currentStep >= 1 ? 'bg-primary' : 'bg-white/20'}`} />
          <div className={`h-2 w-16 rounded-full transition-all ${currentStep >= 2 ? 'bg-primary' : 'bg-white/20'}`} />
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait" custom={currentStep}>
            {/* Step 0: Select Merchant */}
            {currentStep === 0 && (
              <motion.div
                key="merchants"
                custom={0}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="flex-1 flex flex-col justify-center">
                  <motion.h1
                    variants={itemVariants}
                    className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center"
                  >
                    Select a Merchant
                  </motion.h1>
                  <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground text-center mb-8"
                  >
                    Choose the merchant whose cart you want to view
                  </motion.p>

                  {loading ? (
                    <div className="text-center text-muted-foreground">Loading merchants...</div>
                  ) : (
                    <div className="relative flex items-center justify-center pb-12">
                      {/* Navigation Arrows */}
                      {merchants.length > 1 && (
                        <>
                          {/* Left Arrow - only show if not on first card */}
                          {currentMerchantIndex > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentMerchantIndex(currentMerchantIndex - 1);
                              }}
                              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                            >
                              <ChevronLeft className="w-5 h-5 text-foreground" />
                            </button>
                          )}
                          {/* Right Arrow - only show if not on last card */}
                          {currentMerchantIndex < merchants.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentMerchantIndex(currentMerchantIndex + 1);
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                            >
                              <ChevronRight className="w-5 h-5 text-foreground" />
                            </button>
                          )}
                        </>
                      )}

                      {/* Carousel Container - Shows current card centered + peek of next */}
                      <div className="w-full max-w-2xl px-14">
                        <div className="overflow-x-hidden overflow-y-visible py-2">
                          <motion.div
                            className="flex gap-4"
                            animate={{
                              x: `calc(-${currentMerchantIndex * 100}%)`
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            {merchants.map((merchant, index) => (
                              <motion.div
                                key={merchant._id}
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                                onClick={() => {
                                  setSelectedMerchant(merchant);
                                  setCurrentMerchantIndex(index);
                                }}
                                className={`flex-shrink-0 bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 cursor-pointer transition-all ${
                                  selectedMerchant?._id === merchant._id
                                    ? 'border-primary shadow-lg shadow-primary/20'
                                    : 'border-white/20 hover:border-primary/60 opacity-60 hover:opacity-80'
                                }`}
                                style={{ width: 'calc(100% - 1rem)' }}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="bg-gradient-primary p-3 rounded-lg flex-shrink-0">
                                    <Building2 className="w-6 h-6 text-primary-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                                      {merchant.businessName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground truncate mb-2">{merchant.email}</p>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20">
                                      <StoreIcon className="w-3.5 h-3.5 text-primary" />
                                      <span className="text-xs text-foreground font-medium">
                                        {merchant.stores.length} store{merchant.stores.length !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </div>

                      {/* Dots Indicator */}
                      {merchants.length > 1 && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
                          {merchants.map((merchant, index) => (
                            <button
                              key={merchant._id}
                              onClick={() => setCurrentMerchantIndex(index)}
                              className={`h-2 rounded-full transition-all ${
                                currentMerchantIndex === index
                                  ? 'w-6 bg-primary'
                                  : 'w-2 bg-white/30 hover:bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Home
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleNextFromMerchants}
                    disabled={!selectedMerchant}
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Select Store */}
            {currentStep === 1 && selectedMerchant && (
              <motion.div
                key="stores"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="flex-1 flex flex-col justify-center">
                  <motion.h1
                    variants={itemVariants}
                    className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center"
                  >
                    Select a Store
                  </motion.h1>
                  <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground text-center mb-8"
                  >
                    Choose a store from {selectedMerchant.businessName}
                  </motion.p>

                  <div className="relative flex items-center justify-center pb-12">
                    {/* Navigation Arrows */}
                    {selectedMerchant.stores.length > 1 && (
                      <>
                        {/* Left Arrow - only show if not on first card */}
                        {currentStoreIndex > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentStoreIndex(currentStoreIndex - 1);
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                          >
                            <ChevronLeft className="w-5 h-5 text-foreground" />
                          </button>
                        )}
                        {/* Right Arrow - only show if not on last card */}
                        {currentStoreIndex < selectedMerchant.stores.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentStoreIndex(currentStoreIndex + 1);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                          >
                            <ChevronRight className="w-5 h-5 text-foreground" />
                          </button>
                        )}
                      </>
                    )}

                    {/* Carousel Container - Shows current card centered + peek of next */}
                    <div className="w-full max-w-2xl px-14">
                      <div className="overflow-x-hidden overflow-y-visible py-2">
                        <motion.div
                          className="flex gap-4"
                          animate={{
                            x: `calc(-${currentStoreIndex * 100}%)`
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          {selectedMerchant.stores.map((store, index) => (
                            <motion.div
                              key={store.storeId}
                              whileHover={{ scale: 1.015 }}
                              whileTap={{ scale: 0.985 }}
                              onClick={() => {
                                setSelectedStore(store);
                                setCurrentStoreIndex(index);
                              }}
                              className={`flex-shrink-0 bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 cursor-pointer transition-all ${
                                selectedStore?.storeId === store.storeId
                                  ? 'border-primary shadow-lg shadow-primary/20'
                                  : 'border-white/20 hover:border-primary/60 opacity-60 hover:opacity-80'
                              }`}
                              style={{ width: 'calc(100% - 1rem)' }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="bg-gradient-primary p-3 rounded-lg flex-shrink-0">
                                  <StoreIcon className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                                    {store.storeName}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-2 truncate">{store.platform}</p>
                                  <div className="inline-flex items-center gap-2">
                                    <span
                                      className={`text-xs px-2.5 py-1 rounded-full ${
                                        store.enabled
                                          ? 'bg-green-500/20 text-green-300'
                                          : 'bg-red-500/20 text-red-300'
                                      }`}
                                    >
                                      {store.enabled ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </div>

                    {/* Dots Indicator */}
                    {selectedMerchant.stores.length > 1 && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
                        {selectedMerchant.stores.map((store, index) => (
                          <button
                            key={store.storeId}
                            onClick={() => setCurrentStoreIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                              currentStoreIndex === index
                                ? 'w-6 bg-primary'
                                : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleNextFromStores}
                    disabled={!selectedStore}
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Enter Cart Details */}
            {currentStep === 2 && (
              <motion.div
                key="cart"
                custom={2}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center"
                >
                  Select a Cart
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-muted-foreground text-center mb-8"
                >
                  Enter your cart ID to view its details and get personalized AI offers
                </motion.p>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg max-w-xl mx-auto mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-primary p-3 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">Enter Cart ID</h2>
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedStore?.storeName} ({selectedMerchant?.businessName})
                      </p>
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
                        onKeyDown={(e) => e.key === 'Enter' && handleViewCart()}
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
                        onKeyDown={(e) => e.key === 'Enter' && handleViewCart()}
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

                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectCart;
