import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { Input, Button } from '../../components/common';
import { Package, ArrowRight, Shield, Zap, BarChart3, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    try {
      const result = await register(formData).unwrap();

      // Store credentials
      dispatch(
        setCredentials({
          user: result.data.user,
          token: result.data.token,
        })
      );

      setSuccess(true);

      // Redirect to verification waiting page after 2 seconds
      setTimeout(() => {
        navigate('/verify-email-waiting');
      }, 2000);
    } catch (err) {
      console.log('Error caught:', err);

      // Handle validation errors
      if (err.details && Array.isArray(err.details)) {
        const fieldErrors = {};
        err.details.forEach((error) => {
          fieldErrors[error.field] = error.message;
        });
        setErrors(fieldErrors);
      }

      // Always show the server message if available
      if (err.message) {
        setServerError(err.message);
      } else {
        setServerError('Registration failed. Please try again.');
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Welcome aboard!
          </h2>
          <p className="text-slate-600 mb-2">
            We've sent a verification email to
          </p>
          <p className="font-semibold text-slate-900 mb-6">{formData.email}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-[#7C3E8C] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#7C3E8C] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[#7C3E8C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <p className="ml-2">Redirecting to verification page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Left Side - Branding/Illustration */}
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
                Start managing your inventory with confidence
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Real-time Tracking</h3>
                  <p className="text-sm text-white/70">Monitor your inventory levels in real-time</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Multi-Business Support</h3>
                  <p className="text-sm text-white/70">Manage multiple businesses from one account</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Team Collaboration</h3>
                  <p className="text-sm text-white/70">Work together with your team seamlessly</p>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7C3E8C] font-semibold hover:text-[#5B2C7A] transition-colors cursor-pointer">
                Sign in
              </Link>
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
              label="Full Name"
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="John Doe"
            />

            <Input
              label="Email Address"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
            />

            <Input
              label="Phone Number"
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              placeholder="+1234567890"
            />

            <Input
              label="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              hint="Must be at least 8 characters with uppercase, lowercase, number and special character"
              placeholder="••••••••"
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
            />

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-[#7C3E8C] border-gray-300 rounded focus:ring-[#7C3E8C]"
              />
              <label htmlFor="agreedToTerms" className="ml-2 text-xs text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-[#7C3E8C] hover:underline cursor-pointer">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#7C3E8C] hover:underline cursor-pointer">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreedToTerms && (
              <p className="text-xs text-red-600">{errors.agreedToTerms}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="group"
            >
              <span className="flex items-center justify-center gap-2">
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
