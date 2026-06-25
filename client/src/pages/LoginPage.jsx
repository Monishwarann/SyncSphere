import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, MessageSquare, Loader2 } from 'lucide-react';
import API from '../services/api';

const LoginPage = ({ onLoginSuccess, showToast }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      
      // Store user details in LocalStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Notify parent state
      onLoginSuccess(response.data);
      showToast('Signed in successfully! Welcome back.', 'success');
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative min-h-screen">
      {/* Background visual glow blobs */}
      <div className="bg-glow-blob bg-indigo-500 w-[350px] h-[350px] top-1/4 left-1/3"></div>
      <div className="bg-glow-blob bg-violet-600 w-[350px] h-[350px] bottom-1/4 right-1/3"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-neon-indigo">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-obsidian-200 to-indigo-300 bg-clip-text text-transparent">
          Welcome back to SyncSphere
        </h2>
        <p className="mt-2 text-center text-sm text-obsidian-400 font-medium">
          Or{' '}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            create a new developer profile
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-obsidian-300 uppercase tracking-wider">
                Email or Username
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-obsidian-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 rounded-xl border glass-input text-white text-sm"
                  placeholder="name@example.com or alex_dev"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-obsidian-300 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-obsidian-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 rounded-xl border glass-input text-white text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg hover:shadow-indigo-500/25 transition-all duration-150 transform hover:scale-[1.01] active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
