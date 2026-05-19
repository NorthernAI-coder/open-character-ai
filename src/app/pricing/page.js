"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Zap, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState(null);

  const handleCheckout = async (amount) => {
    if (status !== "authenticated") {
      router.push("/api/auth/signin");
      return;
    }

    try {
      setLoadingTier(amount);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to initialize checkout session");
        setLoadingTier(null);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoadingTier(null);
    }
  };

  const plans = [
    {
      name: "Starter Bundle",
      amount: 1,
      credits: 200,
      description: "Perfect for quick sessions and casual chatting.",
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      color: "from-blue-600/20 to-blue-900/20 border-blue-500/30",
      buttonColor: "bg-blue-600 hover:bg-blue-500",
      features: [
        "200 Premium Credits",
        "~100 Standard Messages",
        "Zero queue waiting",
        "Never expires",
      ]
    },
    {
      name: "Pro Pack",
      amount: 5,
      credits: 1000,
      description: "Our most popular pack for daily power users.",
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      color: "from-amber-600/20 to-amber-900/20 border-amber-500/50 scale-105 shadow-2xl shadow-amber-900/20",
      buttonColor: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/25",
      isPopular: true,
      features: [
        "1000 Premium Credits",
        "~500 Standard Messages",
        "Zero queue waiting",
        "Never expires",
        "Priority LLM Routing"
      ]
    },
    {
      name: "Mega Bundle",
      amount: 10,
      credits: 2000,
      description: "For heavy users building complex personas.",
      icon: <Sparkles className="w-5 h-5 text-violet-400" />,
      color: "from-violet-600/20 to-violet-900/20 border-violet-500/30",
      buttonColor: "bg-violet-600 hover:bg-violet-500",
      features: [
        "2000 Premium Credits",
        "~1000 Standard Messages",
        "Zero queue waiting",
        "Never expires",
        "Highest Quality Models"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans relative overflow-hidden select-none">
      
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-6 border-b border-zinc-800/50 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Dashboard</span>
        </Link>
        <div className="font-black text-xl tracking-tight flex items-center gap-2">
          (character.ai<span className="text-amber-500">+</span>)
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-16 relative z-10 flex flex-col items-center">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Pay as you go
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
            Fuel your imagination.
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto font-medium text-sm md:text-base leading-relaxed">
            Purchase premium credits to power your custom AI characters. No recurring subscriptions, no hidden fees. Just top up whenever you need more compute.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-center">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`relative bg-gradient-to-br bg-[#121214] border rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${plan.color}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-zinc-950/50 shadow-inner">
                  {plan.icon}
                </div>
                <h3 className="font-bold text-lg text-zinc-100">{plan.name}</h3>
              </div>
              
              <p className="text-xs text-zinc-400 font-medium mb-6 min-h-[32px]">{plan.description}</p>
              
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black">${plan.amount}</span>
                <span className="text-zinc-500 font-bold text-sm">USD</span>
              </div>
              
              <div className="py-4 border-y border-zinc-800/50 mb-6 space-y-3">
                {plan.features.map((feat, fidx) => (
                  <div key={fidx} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCheckout(plan.amount)}
                disabled={loadingTier !== null}
                className={`mt-auto w-full py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${plan.buttonColor}`}
              >
                {loadingTier === plan.amount ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Buy {plan.credits} Credits</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
