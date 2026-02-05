import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { Input, Button } from '../../components/common';
import { Package, ArrowLeft, Shield, Lock, CheckCircle2, UserPlus } from 'lucide-react';

const SetupAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    // Client-side validation
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/setup-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store credentials
        if (data.data && data.data.user && data.data.token) {
          dispatch(
            setCredentials({
              user: data.data.user,
              token: data.data.token,
            })
          );
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          // Redirect to login if no credentials returned
          navigate('/login?setup=success');
        }
      } else {
        // Handle validation errors
        if (data.details && Array.isArray(data.details)) {
          const fieldErrors = {};
          data.details.forEach((error) => {
            fieldErrors[error.field] = error.message;
          });
          setErrors(fieldErrors);
        }

        // Show server error message
        if (data.message) {
          setServerError(data.message);
        } else {
          setServerError('Account setup failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Setup account error:', err);
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2A1142] via-[#4A1D66] to-[#2A1142] relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#7C3E8C]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Package className="w-8 h-8 text-[#2A1142]" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Stockavoo</h1>
                  <p className="text-[#D4AF37] text-sm font-medium">
                    Inventory Management
                  </p>
                </div>
              </div>
              <p className="text-white/70 text-lg">
                Welcome to the team! Let's set up your account.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Setup</h3>
                  <p className="text-sm text-white/70">Just create a password to get started</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure & Encrypted</h3>
                  <p className="text-sm text-white/70">Your data is protected with industry-standard encryption</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Instant Access</h3>
                  <p className="text-sm text-white/70">Access your dashboard immediately after setup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4A1D66] to-[#7C3E8C] rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Stockavoo
              </h1>
            </div>
            <p className="text-sm text-slate-600">Inventory Management</p>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Set Up Your Account</h2>
            <p className="text-slate-600">
              Create a password to activate your account and get started.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-8">
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-sm text-red-700">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Create Password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                hint="Must be at least 8 characters"
                placeholder="••••••••"
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="••••••••"
                autoComplete="new-password"
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="group"
              >
                <span className="flex items-center justify-center gap-2">
                  Activate Account
                  <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </span>
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-[#7C3E8C] font-semibold hover:text-[#5B2C7A] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupAccount;
