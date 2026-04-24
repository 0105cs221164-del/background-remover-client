import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext.jsx";

const PLANS = [
  {
    id:       "basic",
    label:    "Basic",
    credits:  50,
    price:    "₹499",
    perCredit:"₹9.98",
    features: ["50 background removals", "HD quality output", "Valid forever"],
    highlight: false,
  },
  {
    id:       "pro",
    label:    "Pro",
    credits:  150,
    price:    "₹999",
    perCredit:"₹6.66",
    features: ["150 background removals", "HD quality output", "Valid forever", "Best value"],
    highlight: true,
  },
  {
    id:       "premium",
    label:    "Premium",
    credits:  500,
    price:    "₹2499",
    perCredit:"₹4.99",
    features: ["500 background removals", "HD quality output", "Valid forever", "Lowest per-credit price"],
    highlight: false,
  },
];

// Dynamically load the Razorpay checkout script
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id  = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const BuyCredits = () => {
  const { backendUrl, credits, setCredits } = useApp();
  const [loadingPlan, setLoadingPlan]       = useState(null);
  const [searchParams, setSearchParams]     = useSearchParams();

  // Handle redirect back (only used for edge-case query params)
  useEffect(() => {
    const status  = searchParams.get("status");
    const added   = searchParams.get("credits");

    if (status === "success" && added) {
      toast.success(`${added} credits added to your account!`);
      axios.get(`${backendUrl}/api/payment/credits`)
        .then(({ data }) => { if (data.success) setCredits(data.credits); })
        .catch(() => {});
      setSearchParams({});
    } else if (status === "cancelled") {
      toast.error("Payment cancelled.");
      setSearchParams({});
    }
  }, []);

  const handlePurchase = async (planId) => {
    setLoadingPlan(planId);

    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay. Check your internet connection.");
        setLoadingPlan(null);
        return;
      }

      // 2. Create order on backend
      const { data } = await axios.post(`${backendUrl}/api/payment/create-order`, { planId });
      if (!data.success) {
        toast.error(data.message || "Failed to create order");
        setLoadingPlan(null);
        return;
      }

      const { order, key } = data;

      // 3. Open Razorpay checkout
      const options = {
        key,
        amount:      order.amount,
        currency:    order.currency,
        name:        "BgEraser",
        description: `${PLANS.find(p => p.id === planId)?.credits || ""} background removal credits`,
        order_id:    order.id,
        handler: async (response) => {
          // 4. Verify payment on backend
          try {
            const { data: verifyData } = await axios.post(
              `${backendUrl}/api/payment/verify`,
              {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                planId,
              }
            );
            if (verifyData.success) {
              toast.success(`${PLANS.find(p => p.id === planId)?.credits} credits added!`);
              setCredits(verifyData.credits);
            } else {
              toast.error(verifyData.message || "Payment verification failed");
            }
          } catch (err) {
            toast.error("Payment verification failed. Contact support if money was deducted.");
          } finally {
            setLoadingPlan(null);
          }
        },
        prefill: {},
        theme: { color: "#6C63FF" },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled.");
            setLoadingPlan(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed to start");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Buy Credits</h1>
        <p className="text-white/50">
          You currently have{" "}
          <span className="text-brand-500 font-semibold">{credits} credit{credits !== 1 ? "s" : ""}</span>.
          Each removal costs 1 credit.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={
              "card flex flex-col relative transition-transform hover:-translate-y-1 duration-200 " +
              (plan.highlight ? "border-brand-500/60 ring-1 ring-brand-500/30" : "")
            }
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                Most Popular
              </span>
            )}

            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">{plan.label}</h2>
              <div className="text-3xl font-bold mb-0.5">{plan.price}</div>
              <div className="text-white/40 text-xs">{plan.perCredit} per credit</div>
            </div>

            <div className="text-4xl font-bold text-brand-500 mb-4">
              {plan.credits}
              <span className="text-base font-normal text-white/50 ml-1">credits</span>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePurchase(plan.id)}
              disabled={loadingPlan !== null}
              className={
                "w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 " +
                (plan.highlight
                  ? "btn-primary"
                  : "btn-outline hover:bg-white/5")
              }
            >
              {loadingPlan === plan.id ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Buy ${plan.label}`
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="card text-center py-5">
        <div className="flex items-center justify-center gap-8 flex-wrap text-white/40 text-sm">
          <span>🔒 Secured by Razorpay</span>
          <span>💳 UPI, cards, wallets & more</span>
          <span>✅ Credits never expire</span>
          <span>🔄 Instant activation</span>
        </div>
      </div>
    </div>
  );
};

export default BuyCredits;
