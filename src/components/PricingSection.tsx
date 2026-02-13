import { Check, Crown, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface PricingSectionProps {
  language: string;
}

// TODO: Replace these with your actual Stripe price IDs from the Stripe Dashboard
const PRICE_IDS = {
  monthly: "price_MONTHLY_PLACEHOLDER",
  yearly: "price_YEARLY_PLACEHOLDER",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Star,
    description: "Perfect for trying out the piano",
    features: [
      "Grand Piano instrument",
      "3 beginner lessons",
      "Keyboard & touch controls",
      "32+ language support",
    ],
    locked: [
      "Premium instruments (4+)",
      "Advanced & intermediate lessons",
      "Recording & audio export",
      "Priority support",
    ],
    cta: "Current Plan",
    popular: false,
    gradient: "from-secondary/80 to-secondary/40",
    priceId: null,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    icon: Crown,
    description: "Unlock the full piano experience",
    features: [
      "All 5 instruments unlocked",
      "All lessons (beginner to advanced)",
      "Recording & MP3 export",
      "Priority support",
      "New instruments & lessons monthly",
      "Ad-free experience",
    ],
    locked: [],
    cta: "Upgrade to Premium",
    popular: true,
    gradient: "from-primary to-accent",
    priceId: PRICE_IDS.monthly,
  },
  {
    name: "Yearly",
    price: "$79.99",
    period: "/year",
    icon: Zap,
    description: "Best value — save 33%",
    features: [
      "Everything in Premium",
      "Save $39.89 per year",
      "Early access to new features",
      "Exclusive masterclass content",
    ],
    locked: [],
    cta: "Get Yearly Plan",
    popular: false,
    gradient: "from-amber-500 to-amber-600",
    priceId: PRICE_IDS.yearly,
  },
];

export const PricingSection = ({ language }: PricingSectionProps) => {
  const { user, subscription, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    if (priceId.includes("PLACEHOLDER")) {
      toast({
        title: "Coming Soon",
        description: "Premium subscriptions will be available once Stripe products are configured. Please create products in your Stripe Dashboard and update the price IDs.",
      });
      return;
    }

    setLoadingPlan(planName);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <section id="pricing" className="w-full" aria-label="Pricing Plans">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Premium Features</span>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-2">
          Unlock Your Full Potential
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Choose the plan that fits your musical journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "relative glass-panel rounded-2xl p-6 flex flex-col transition-all duration-300",
              plan.popular
                ? "border-primary/40 shadow-[0_0_40px_rgba(168,85,247,0.15)] scale-[1.02] md:scale-105"
                : "border-white/10 hover:border-white/20"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold rounded-full shadow-lg">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2.5 rounded-xl bg-gradient-to-br", plan.gradient)}>
                <plan.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-black text-foreground">{plan.price}</span>
              <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{feature}</span>
                </li>
              ))}
              {plan.locked.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm opacity-40">
                  <Crown className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground line-through">{feature}</span>
                </li>
              ))}
            </ul>

            {subscription.subscribed && plan.name !== "Free" ? (
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/10"
                size="lg"
              >
                Manage Subscription
              </Button>
            ) : (
              <Button
                className={cn(
                  "w-full font-bold",
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg"
                    : plan.name === "Yearly"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-white"
                    : "bg-secondary/50 hover:bg-secondary/70 text-foreground"
                )}
                size="lg"
                disabled={plan.name === "Free" || loadingPlan === plan.name}
                onClick={() => handleSubscribe(plan.priceId, plan.name)}
              >
                {loadingPlan === plan.name ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  plan.cta
                )}
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-muted-foreground/60">
        <span>🔒 Secure payment</span>
        <span>•</span>
        <span>💳 Cancel anytime</span>
        <span>•</span>
        <span>🌍 Available worldwide</span>
        <span>•</span>
        <span>⚡ Instant access</span>
      </div>
    </section>
  );
};
