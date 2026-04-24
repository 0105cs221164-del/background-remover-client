import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const STEPS = [
  { icon: "⬆️", title: "Upload your image",     desc: "Drag & drop or click to upload any JPG, PNG, or WebP" },
  { icon: "✨", title: "AI removes background", desc: "Remove.bg processes it in seconds with pixel-perfect accuracy" },
  { icon: "⬇️", title: "Download the result",   desc: "Get a clean transparent PNG — ready for any project" },
];

const SAMPLES = [
  { label: "People",   emoji: "🧍" },
  { label: "Products", emoji: "📦" },
  { label: "Animals",  emoji: "🐶" },
  { label: "Objects",  emoji: "🪴" },
];

const Home = () => {
  const { user } = useApp();
  const navigate  = useNavigate();

  const handleCTA = () => navigate(user ? "/dashboard" : "/register");

  return (
    <div className="max-w-4xl mx-auto px-4">

      {/* ── Hero ──────────────────────────────────── */}
      <section className="text-center py-20">
        <span className="inline-block bg-brand-500/10 text-brand-500 text-xs font-semibold px-3 py-1 rounded-full mb-6 border border-brand-500/20">
          Powered by Remove.bg AI
        </span>

        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-5">
          Remove backgrounds
          <br />
          <span className="text-brand-500">in one click</span>
        </h1>

        <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
          Upload any image and our AI instantly removes the background.
          Download a clean transparent PNG — no design skills needed.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button onClick={handleCTA} className="btn-primary text-base px-8 py-3">
            {user ? "Go to Dashboard" : "Try for free →"}
          </button>
          {!user && (
            <p className="text-white/40 text-sm">No credit card required · 5 free credits</p>
          )}
        </div>
      </section>

      {/* ── Category pills ────────────────────────── */}
      <section className="flex justify-center gap-3 flex-wrap mb-16">
        {SAMPLES.map((s) => (
          <div key={s.label} className="card py-2 px-5 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors cursor-default">
            <span>{s.emoji}</span> {s.label}
          </div>
        ))}
      </section>

      {/* ── How it works ──────────────────────────── */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="card text-center">
              <div className="text-4xl mb-3">{step.icon}</div>
              <div className="text-xs text-brand-500 font-semibold mb-1">STEP {i + 1}</div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────── */}
      <section className="card mb-20">
        <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
          {[
            { value: "5s",   label: "Avg. processing time" },
            { value: "99%",  label: "Accuracy rate" },
            { value: "Free", label: "5 credits on signup" },
          ].map((stat) => (
            <div key={stat.label} className="py-4 px-2">
              <div className="text-2xl font-bold text-brand-500 mb-1">{stat.value}</div>
              <div className="text-white/40 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────── */}
      <section className="text-center pb-20">
        <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-white/50 mb-6">Join thousands removing backgrounds instantly.</p>
        <button onClick={handleCTA} className="btn-primary text-base px-10 py-3">
          {user ? "Open Dashboard" : "Create free account"}
        </button>
      </section>

    </div>
  );
};

export default Home;
