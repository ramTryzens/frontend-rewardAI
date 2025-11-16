import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Dices, Gift, DollarSign, Trophy, XCircle, Award, Coins, Star, Percent } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { evaluateSmartOffers } from "@/lib/api";

interface PromotionCardsProps {
  cartId?: string;
  customerId?: string | number;
  cartTotal?: number;
  merchantId?: string;
  storeId?: string;
  merchantEmail?: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

const PromotionCards = ({ cartId, customerId, cartTotal = 49.52, merchantId, storeId, merchantEmail, onLoadingChange }: PromotionCardsProps) => {
  // Fallback hardcoded data (from your friend)
  const fallbackData = {
    proposedDiscountPercentage: "25",
    proposedDiscountAmount: 12.38,
    proposedLoyaltyPoints: 12,
    proposedMinBidAmount: 10,
    proposedSpinWheelValues: [15, 13, 12, 10]
  };

  // State for AI data (from n8n API or fallback)
  const [aiProposedData, setAiProposedData] = useState<typeof fallbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bidding game state
  const [userBid, setUserBid] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userWon, setUserWon] = useState(false);
  const [hasBid, setHasBid] = useState(false);

  // Spin wheel state
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<number | null>(null);
  const [showWheelResult, setShowWheelResult] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<number>(0);
  const [hasSpun, setHasSpun] = useState(false);

  // Fetch AI data from n8n with fallback
  useEffect(() => {
    const fetchAiData = async () => {
      setLoading(true);
      onLoadingChange?.(true);
      setError(null);
      try {
        const payload = {
          customerId: customerId || 3,
          cartId: cartId || "50656685-567c-42c9-9a1e-9389e9f76b68",
          merchantId: merchantId || "",
          storeId: storeId || "",
          merchantEmail: merchantEmail || ""
        };

        console.log('📤 Sending to n8n evaluate:', payload);

        const data = await evaluateSmartOffers(payload);

        console.log('📥 n8n API Response:', data);

        // If we got valid data from n8n, use it
        if (data && data.length > 0) {
          const firstOffer = data[0] as any;
          // Check if data is nested inside 'output' property
          const offerData = firstOffer.output || firstOffer;

          console.log('📦 Parsed offer data:', offerData);

          // Parse n8n response and map to our format
          const n8nData = {
            proposedDiscountPercentage: String(offerData.proposedDiscountPercentage || fallbackData.proposedDiscountPercentage),
            proposedDiscountAmount: Number(offerData.proposedDiscountAmount) || fallbackData.proposedDiscountAmount,
            proposedLoyaltyPoints: Number(offerData.proposedLoyaltyPoints) || fallbackData.proposedLoyaltyPoints,
            proposedMinBidAmount: Number(offerData.proposedMinBidAmount) || fallbackData.proposedMinBidAmount,
            proposedSpinWheelValues: Array.isArray(offerData.proposedSpinWheelValues) ? offerData.proposedSpinWheelValues : fallbackData.proposedSpinWheelValues
          };

          console.log('✅ Final AI data to display:', n8nData);
          console.log('⚠️ Using fallback for:', {
            minBidAmount: !offerData.proposedMinBidAmount,
            spinWheelValues: !Array.isArray(offerData.proposedSpinWheelValues)
          });
          setAiProposedData(n8nData);
        } else {
          // No data from n8n, use fallback
          console.log('❌ No data from n8n, using fallback');
          setAiProposedData(fallbackData);
        }
      } catch (err) {
        console.error("Error fetching n8n data, using fallback:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch AI data");
        // Use fallback data on error
        setAiProposedData(fallbackData);
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };

    fetchAiData();
  }, [cartId, customerId, merchantId, storeId, merchantEmail, onLoadingChange]);

  // Handle bid submission
  const handleBidSubmit = () => {
    const bidAmount = parseFloat(userBid);

    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    if (hasBid) {
      alert('You can only bid once per cart!');
      return;
    }

    const aiBid = aiProposedData?.proposedMinBidAmount || fallbackData.proposedMinBidAmount;

    setHasBid(true);
    setIsSpinning(true);
    setShowResult(false);

    setTimeout(() => {
      setIsSpinning(false);
      setUserWon(bidAmount > aiBid);
      setShowResult(true);
    }, 3000);
  };

  // Handle spin wheel
  const handleSpinWheel = () => {
    if (hasSpun) {
      alert('You can only spin once per cart!');
      return;
    }

    setHasSpun(true);
    setIsWheelSpinning(true);
    setShowWheelResult(false);

    const spinValues = aiProposedData?.proposedSpinWheelValues || fallbackData.proposedSpinWheelValues;
    const randomIndex = Math.floor(Math.random() * spinValues.length);

    setTimeout(() => {
      setSelectedSegment(randomIndex);
      setWheelResult(spinValues[randomIndex]);
      setIsWheelSpinning(false);
      setShowWheelResult(true);
    }, 3000);
  };

  const promotions = [
    {
      id: 1,
      icon: Sparkles,
      title: "Generative Discount",
      description: "AI-powered personalized discount just for you"
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Join Us, Spend more. Save more",
      description: "Unlock exclusive benefits and greater savings as you shop more"
    },
    {
      id: 3,
      icon: Dices,
      title: "Try Your Luck: Bid against AI",
      description: "Challenge our AI in an exciting bidding game"
    },
    {
      id: 4,
      icon: Star,
      title: "Spin and Win",
      description: "Spin the wheel and win exciting prizes!"
    }
  ];

  const wheelIcons = [Gift, Trophy, Coins, DollarSign];

  return (
    <div className="space-y-4">
      {promotions.map((promo, index) => {
        const Icon = promo.icon;

        // Special rendering for Generative Discount with AI Proposed data
        if (promo.id === 1) {
          // Only show if proposedDiscountAmount exists
          if (!aiProposedData?.proposedDiscountAmount) {
            return null;
          }
          return (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors border border-white/10"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-lg shrink-0 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {promo.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {promo.description}
                  </p>
                </div>
              </div>

              {loading || !aiProposedData ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
                  <p className="text-muted-foreground text-sm mt-4">Loading AI offer...</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4 text-xs text-yellow-400">
                      Using fallback data: {error}
                    </div>
                  )}
                  {/* AI Proposed Discount Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-orange-900/40 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10 animate-pulse" />

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                            <Percent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-foreground">AI Proposed Discount</h4>
                            <p className="text-xs text-muted-foreground">Personalized just for you</p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg px-4 py-2 shadow-lg">
                          {aiProposedData.proposedDiscountPercentage}% OFF
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-xl p-4 border border-purple-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-purple-400" />
                            <p className="text-xs text-muted-foreground">AI Discount Amount</p>
                          </div>
                          <p className="text-2xl font-bold text-purple-400">
                            ${aiProposedData.proposedDiscountAmount.toFixed(2)}
                          </p>
                        </div>

                        <div className="bg-black/30 rounded-xl p-4 border border-green-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4 text-green-400" />
                            <p className="text-xs text-muted-foreground">Your Cart Total</p>
                          </div>
                          <p className="text-2xl font-bold text-green-400">
                            ${(cartTotal - aiProposedData.proposedDiscountAmount).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Original Cart Total</p>
                            <p className="text-lg font-semibold text-foreground line-through opacity-60">
                              ${cartTotal.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">You Save</p>
                            <p className="text-2xl font-bold text-pink-400">
                              ${aiProposedData.proposedDiscountAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          );
        }

        // Special rendering for Loyalty Points section
        if (promo.id === 2) {
          // Only show if proposedLoyaltyPoints exists
          if (!aiProposedData?.proposedLoyaltyPoints) {
            return null;
          }
          return (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors border border-white/10"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-lg shrink-0 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {promo.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {promo.description}
                  </p>
                </div>
              </div>

              {loading || !aiProposedData ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
                  <p className="text-muted-foreground text-sm mt-4">Loading AI offer...</p>
                </div>
              ) : (
                <>
                  {/* Loyalty Points Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-teal-900/40 rounded-2xl p-6 border border-green-500/30 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 animate-pulse" />

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                            <Coins className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-foreground">Store Credit Points</h4>
                            <p className="text-xs text-muted-foreground">Earned from this purchase</p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xl px-5 py-2 shadow-lg">
                          {aiProposedData.proposedLoyaltyPoints} pts
                        </Badge>
                      </div>

                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                        <div className="text-center space-y-2">
                          <p className="text-sm text-muted-foreground">You have earned</p>
                          <p className="text-5xl font-bold text-green-400">
                            {aiProposedData.proposedLoyaltyPoints}
                          </p>
                          <p className="text-lg text-foreground">Store Credit Points</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { icon: Award, label: "Rewards", value: `+${aiProposedData.proposedLoyaltyPoints}pts` },
                          { icon: Star, label: "Status", value: "Gold" },
                          { icon: Gift, label: "Perks", value: "Active" }
                        ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="bg-black/30 rounded-lg p-3 border border-green-500/20 text-center"
                      >
                        <item.icon className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-foreground">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
                </>
              )}
            </motion.div>
          );
        }

        // Special rendering for Try Your Luck - Bid against AI
        if (promo.id === 3) {
          // Only show if proposedMinBidAmount exists
          if (!aiProposedData?.proposedMinBidAmount) {
            return null;
          }
          return (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors border border-white/10"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-orange-600 to-amber-600 p-3 rounded-lg shrink-0 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    {promo.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    This is one time Bid for your cart against AI. Try your luck to see if you can unlock a personalized bid.
                  </p>
                </div>
              </div>

              {loading || !aiProposedData ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
                  <p className="text-muted-foreground text-sm mt-4">Loading AI offer...</p>
                </div>
              ) : (
                <>
                  {/* Bidding Interface */}
                  {!hasBid && (
                    <div className="space-y-3">
                      <Input
                        type="number"
                        placeholder="Enter your bid amount"
                        value={userBid}
                        onChange={(e) => setUserBid(e.target.value)}
                        className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground"
                      />
                      <Button
                        onClick={handleBidSubmit}
                        disabled={!userBid}
                        className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white font-semibold py-3"
                      >
                        <Dices className="w-5 h-5 mr-2" />
                        Bid and Win against AI
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        AI bid amount is ${aiProposedData.proposedMinBidAmount.toFixed(2)}
                      </p>
                    </div>
                  )}

              {/* Spin Wheel Animation */}
              <AnimatePresence>
                {isSpinning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <motion.div
                      animate={{ rotate: 1440 }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                      className="relative"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center"
                      >
                        <div className="w-28 h-28 rounded-full bg-gradient-bg flex items-center justify-center">
                          <Dices className="w-12 h-12 text-foreground" />
                        </div>
                      </motion.div>
                    </motion.div>
                    <p className="text-foreground font-semibold mt-6 text-lg">
                      Spinning the wheel...
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                      Let's see if you beat the AI!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result Display */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-4 p-6 rounded-lg border-2 ${
                      userWon
                        ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-red-500/10 border-red-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {userWon ? (
                        <Trophy className="w-8 h-8 text-green-400" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-400" />
                      )}
                      <h4 className={`text-xl font-bold ${
                        userWon ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {userWon ? 'Hurray! You Won!' : 'AI Won This Round!'}
                      </h4>
                    </div>

                    {userWon ? (
                      <div className="space-y-2">
                        <p className="text-foreground">
                          Congratulations! You have won the bid against AI!
                        </p>
                        <p className="text-lg font-bold text-green-400">
                          Your cart total is now ${parseFloat(userBid).toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-foreground mb-3">
                          Sorry, AI won the bid against your bid. Please try again with your next order!
                        </p>
                        <div className="bg-white/5 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Your Bid:</span>
                            <span className="text-foreground font-semibold">${parseFloat(userBid).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">AI Bid:</span>
                            <span className="text-foreground font-semibold">${(aiProposedData?.proposedMinBidAmount || fallbackData.proposedMinBidAmount).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
                </>
              )}
            </motion.div>
          );
        }

        // Special rendering for Spin and Win
        if (promo.id === 4) {
          // Only show if proposedSpinWheelValues exists
          if (!aiProposedData?.proposedSpinWheelValues || !Array.isArray(aiProposedData?.proposedSpinWheelValues) || aiProposedData?.proposedSpinWheelValues.length === 0) {
            return null;
          }
          return (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors border border-white/10"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-lg shrink-0 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {promo.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {promo.description}
                  </p>
                </div>
              </div>

              {loading || !aiProposedData ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                  <p className="text-muted-foreground text-sm mt-4">Loading AI offer...</p>
                </div>
              ) : (
                <>
                  {/* Spin Wheel Interface */}
                  {!hasSpun && !isWheelSpinning && (
                    <div className="space-y-6 flex flex-col items-center">
                  {/* Circular Wheel Display */}
                  <div className="relative w-64 h-64">
                    {/* Pointer at the top */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                      <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
                    </div>

                    {/* Outer glow ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur-xl opacity-30 animate-pulse" />

                    {/* Wheel border */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-1">
                      {/* Wheel background */}
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
                        {/* Wheel segments with icons */}
                        {wheelIcons.map((WheelIcon, i) => {
                          const rotation = i * 90;
                          const colors = [
                            'from-blue-500/20 to-blue-600/20',
                            'from-indigo-500/20 to-indigo-600/20',
                            'from-purple-500/20 to-purple-600/20',
                            'from-pink-500/20 to-pink-600/20'
                          ];

                          return (
                            <div
                              key={i}
                              className="absolute inset-0"
                              style={{ transform: `rotate(${rotation}deg)` }}
                            >
                              {/* Segment background */}
                              <div className="absolute inset-0 origin-center">
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-b ${colors[i]} clip-triangle`} />
                              </div>

                              {/* Icon */}
                              <div
                                className="absolute top-12 left-1/2 -translate-x-1/2"
                                style={{ transform: `rotate(-${rotation}deg)` }}
                              >
                                <WheelIcon className="w-10 h-10 text-blue-300 drop-shadow-lg" />
                              </div>
                            </div>
                          );
                        })}

                        {/* Center circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-slate-800 flex items-center justify-center shadow-xl">
                          <Star className="w-8 h-8 text-white" />
                        </div>

                        {/* Divider lines between segments */}
                        {[0, 90, 180, 270].map((angle, i) => (
                          <div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-0.5 h-full bg-slate-700 origin-center -translate-x-1/2 -translate-y-1/2"
                            style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSpinWheel}
                    className="w-full max-w-xs bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <Star className="w-6 h-6 mr-2" />
                    Spin the Wheel!
                  </Button>
                </div>
              )}

              {/* Spinning Animation */}
              <AnimatePresence>
                {isWheelSpinning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <div className="relative w-64 h-64">
                      {/* Pointer at the top - stays fixed */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
                      </div>

                      {/* Outer glow ring */}
                      <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur-xl"
                      />

                      {/* Spinning wheel */}
                      <motion.div
                        animate={{ rotate: 1080 + (360 - selectedSegment * 90) }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        {/* Wheel border */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-1">
                          {/* Wheel background */}
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
                            {/* Wheel segments with icons */}
                            {wheelIcons.map((WheelIcon, i) => {
                              const rotation = i * 90;
                              const colors = [
                                'from-blue-500/20 to-blue-600/20',
                                'from-indigo-500/20 to-indigo-600/20',
                                'from-purple-500/20 to-purple-600/20',
                                'from-pink-500/20 to-pink-600/20'
                              ];

                              return (
                                <div
                                  key={i}
                                  className="absolute inset-0"
                                  style={{ transform: `rotate(${rotation}deg)` }}
                                >
                                  {/* Segment background */}
                                  <div className="absolute inset-0 origin-center">
                                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-b ${colors[i]} clip-triangle`} />
                                  </div>

                                  {/* Icon */}
                                  <div
                                    className="absolute top-12 left-1/2 -translate-x-1/2"
                                    style={{ transform: `rotate(-${rotation}deg)` }}
                                  >
                                    <WheelIcon className="w-10 h-10 text-blue-300 drop-shadow-lg" />
                                  </div>
                                </div>
                              );
                            })}

                            {/* Center circle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-slate-800 flex items-center justify-center shadow-xl">
                              <Star className="w-8 h-8 text-white" />
                            </div>

                            {/* Divider lines between segments */}
                            {[0, 90, 180, 270].map((angle, idx) => (
                              <div
                                key={idx}
                                className="absolute top-1/2 left-1/2 w-0.5 h-full bg-slate-700 origin-center -translate-x-1/2 -translate-y-1/2"
                                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <p className="text-foreground font-semibold mt-8 text-lg">
                      Spinning the wheel...
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                      Let's see what you win!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spin Result */}
              <AnimatePresence>
                {showWheelResult && wheelResult !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-4 p-6 rounded-xl bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-purple-900/40 border-2 border-blue-500/50"
                  >
                    <div className="text-center space-y-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        {React.createElement(wheelIcons[selectedSegment], {
                          className: "w-16 h-16 text-blue-400 mx-auto"
                        })}
                      </motion.div>

                      <div>
                        <h4 className="text-2xl font-bold text-blue-400 mb-2">
                          Congratulations!
                        </h4>
                        <p className="text-foreground text-lg mb-4">
                          You won a discount of
                        </p>
                        <p className="text-4xl font-bold text-green-400 mb-4">
                          ${wheelResult.toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">Original Cart Total:</span>
                          <span className="text-foreground font-semibold line-through">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-foreground font-semibold">Your Cart Total:</span>
                          <span className="text-green-400 font-bold">${(cartTotal - wheelResult).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
                </>
              )}
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default PromotionCards;
