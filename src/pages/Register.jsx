import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8)           score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password))  score++;
  const levels = [
    { label: "",       color: "" },
    { label: "Weak",   color: "bg-red-500" },
    { label: "Fair",   color: "bg-orange-400" },
    { label: "Good",   color: "bg-yellow-400" },
    { label: "Strong", color: "bg-green-500" },
  ];
  return { score, ...levels[score] };
};

const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                         e.name     = "Name is required";
    else if (form.name.trim().length < 2)          e.name     = "Name must be at least 2 characters";
    if (!form.email.trim())                        e.email    = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))  e.email    = "Enter a valid email";
    if (!form.password)                            e.password = "Password is required";
    else if (form.password.length < 6)             e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm)            e.confirm  = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const data = await register(form.name.trim(), form.email.trim(), form.password);
      if (data.success) navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-white/50">Get 5 free credits to start removing backgrounds</p>
        </div>

        <div className="card space-y-5">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className="block text-sm text-white/60 mb-1.5">Full name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange}
                placeholder="Sarthak Sharma"
                className={"input-field " + (errors.name ? "border-red-500" : "")} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-1.5">Email address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className={"input-field " + (errors.email ? "border-red-500" : "")} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? "text" : "password"}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={"input-field pr-12 " + (errors.password ? "border-red-500" : "")} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-xs">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={"h-1 flex-1 rounded-full transition-all duration-300 " +
                        (i <= strength.score ? strength.color : "bg-white/10")} />
                    ))}
                  </div>
                  <p className="text-xs text-white/40">{strength.label}</p>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-1.5">Confirm password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
                placeholder="Re-enter password"
                className={"input-field " + (errors.confirm ? "border-red-500" : "")} />
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-500 hover:text-brand-400 font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
