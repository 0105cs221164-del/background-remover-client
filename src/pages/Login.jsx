import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useApp();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim())                       e.email    = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email    = "Enter a valid email";
    if (!form.password)                           e.password = "Password is required";
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
      const data = await login(form.email.trim(), form.password);
      if (data.success) navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      setErrors({ email: " ", password: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-white/50">Log in to access your dashboard</p>
        </div>

        <div className="card space-y-5">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className="block text-sm text-white/60 mb-1.5">Email address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className={"input-field " + (errors.email?.trim() ? "border-red-500" : "")} />
              {errors.email?.trim() && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm text-white/60">Password</label>
              </div>
              <div className="relative">
                <input name="password" type={showPass ? "text" : "password"}
                  value={form.password} onChange={handleChange}
                  placeholder="Your password"
                  className={"input-field pr-12 " + (errors.password ? "border-red-500" : "")} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-xs">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-500 hover:text-brand-400 font-medium">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
