import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, Lock, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const rep = await axios.post("https://api.kientrucmaihuong.com/api/account/login", {
        username,
        password,
      });

      if (rep.status === 200) {
        localStorage.setItem("isAuthenticated", "true");
        console.log("Login successful");
        navigate("/admin");
      }
    } catch (error: any) {
      alert("Tên đăng nhập hoặc mật khẩu không đúng" + (error.response?.data?.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[var(--color-beige)]"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 text-[var(--color-wood)] mb-4" />
          <h1 className="text-2xl font-serif font-bold text-[var(--color-wood)]">
            Đăng nhập Admin
          </h1>
          <p className="text-[var(--color-charcoal)]/60 text-sm mt-2">
            Vui lòng nhập thông tin để tiếp tục
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal)]/40"
                size={20}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-cream)]/50 border border-[var(--color-beige)] rounded-xl focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal)]/40"
                size={20}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-cream)]/50 border border-[var(--color-beige)] rounded-xl focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--color-wood)] text-white py-3 rounded-xl font-medium hover:bg-[var(--color-gold)] transition-colors flex items-center justify-center group cursor-pointer"
          >
            Đăng nhập
            <ArrowRight
              size={18}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
