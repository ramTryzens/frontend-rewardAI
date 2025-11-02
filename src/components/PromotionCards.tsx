import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Dices } from "lucide-react";

const PromotionCards = () => {
  const promotions = [
    {
      id: 1,
      icon: Sparkles,
      title: "Generative Discount",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Join Us, Spend more. Save more",
      description: "Unlock exclusive benefits and greater savings as you shop more. Join our rewards program today."
    },
    {
      id: 3,
      icon: Dices,
      title: "Try Your Luck: Bid against AI",
      description: "Challenge our AI in an exciting bidding game. Win big discounts and special offers."
    }
  ];

  return (
    <div className="space-y-4">
      {promotions.map((promo, index) => {
        const Icon = promo.icon;
        return (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-primary p-3 rounded-lg shrink-0">
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {promo.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {promo.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PromotionCards;
