"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Palette,
  Users,
  Cloud,
  ShieldCheck,
} from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // ✅ important for cookies / CORS
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login. Please try again.");
      }

      // ✅ Save auth state
      setAuth({
        token: data.token,
        user: { _id: data._id, name: data.name, email: data.email },
      });

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 bg-[var(--surface-light)]">
      <style>{`
        :root {
            --brand-orange: #F57C00;
            --brand-orange-dark: #E65100;
            --brand-blue-dark: #0D47A1;
            --brand-blue-primary: #1976D2;
            --brand-blue-light: #E3F2FD;
            --brand-red: #D32F2F;
            --text-primary: #111318;
            --text-secondary: #6c757d;
            --surface-light: #f8f9fa;
            --surface-dark: #e9ecef;
            --white: #FFFFFF;
            --radius: 12px;
        }
        body {
            font-family: 'Poppins', "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: var(--text-primary);
        }
        .login-btn {
          background: linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-orange-dark) 100%);
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .login-btn:hover::before {
          left: 100%;
        }
        .brand-side::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 1.5rem;
            background-color: var(--brand-blue-dark);
            opacity: 0.85;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="z-10 w-full max-w-6xl">
        <div className="bg-white overflow-hidden rounded-[40px] shadow-2xl">
          <div className="grid min-h-[700px] lg:grid-cols-2">
            {/* Left Side */}
            <div className="brand-side relative m-4 rounded-3xl bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover p-12 text-white">
              <div className="relative z-10">
                <div className="mb-12 text-lg font-semibold uppercase">
                  S3-ECBE' 2026 Conference
                </div>
                <h1 className="mb-4 text-5xl font-medium leading-tight">
                  Smart and Sustainable Solutions
                </h1>
                <p className="mb-12 text-xl opacity-80">
                  Join researchers and professionals to share innovations in
                  engineering.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      icon: <Palette size={16} />,
                      title: "Expert Speakers",
                      desc: "Hear from leaders in multiple engineering fields.",
                    },
                    {
                      icon: <Users size={16} />,
                      title: "Networking Events",
                      desc: "Connect with peers and industry professionals.",
                    },
                    {
                      icon: <Cloud size={16} />,
                      title: "Paper Publications",
                      desc: "Accepted papers published in a book chapter.",
                    },
                    {
                      icon: <ShieldCheck size={16} />,
                      title: "Secure Registration",
                      desc: "Easy and secure online registration process.",
                    },
                  ].map(({ icon, title, desc }, i) => (
                    <div
                      key={i}
                      className="flex items-center"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${
                          0.2 * (i + 1)
                        }s forwards`,
                        opacity: 0,
                      }}
                    >
                      <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm">
                        {icon}
                      </div>
                      <div>
                        <div className="font-semibold">{title}</div>
                        <div className="text-sm opacity-70">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col justify-center p-12">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-light uppercase text-[var(--text-primary)]">
                    Welcome Back
                  </h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Sign in to manage your submission.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium uppercase text-[var(--text-primary)]"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-[var(--surface-dark)] bg-[var(--surface-light)] block w-full rounded-lg border py-3 pr-3 pl-10 text-sm focus:border-[var(--brand-blue-primary)] focus:ring-[var(--brand-blue-primary)]"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium uppercase text-[var(--text-primary)]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-[var(--surface-dark)] bg-[var(--surface-light)] block w-full rounded-lg border py-3 pr-12 pl-10 text-sm focus:border-[var(--brand-blue-primary)] focus:ring-[var(--brand-blue-primary)]"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-[var(--text-secondary)]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-[var(--surface-dark)] text-[var(--brand-blue-primary)] focus:ring-[var(--brand-blue-primary)]"
                      />
                      <span className="ml-2">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[var(--brand-blue-primary)] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {error && (
                    <div
                      className="bg-red-100 border border-[var(--brand-red)] text-[var(--brand-red)] px-4 py-3 rounded-lg relative text-center text-sm"
                      role="alert"
                    >
                      <span className="block sm:inline">{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="login-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="ml-2">Signing in...</span>
                      </>
                    ) : (
                      "Sign in to your account"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
