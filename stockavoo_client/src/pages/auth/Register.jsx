import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { Input, Button } from '../../components/common';

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

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            We've sent a verification email to <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2A1142] via-[#4A1D66] to-[#5B2C7A] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#7C3E8C] rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-2">Stockavoo</h1>
              <p className="text-[#D4AF37] text-lg">Inventory Management System</p>
            </div>

            {/* Illustration/Icon */}
            <div className="mb-8">
              <div className="w-64 h-64 mx-auto bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <svg className="w-32 h-32 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Real-time inventory tracking</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Multi-business management</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Team collaboration tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4A1D66] to-[#7C3E8C] bg-clip-text text-transparent">
              Stockavoo
            </h1>
            <p className="text-sm text-[#D4AF37] mt-1">Inventory Management</p>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-600 mt-1">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7C3E8C] font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border-l-3 border-red-500 rounded text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Google OAuth Button */}
            <a
              href={`${import.meta.env.VITE_API_URL}/auth/google`}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium text-gray-700 text-sm">Google</span>
            </a>

            {/* Facebook OAuth Button */}
            <a
              href={`${import.meta.env.VITE_API_URL}/auth/facebook`}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-medium text-gray-700 text-sm">Facebook</span>
            </a>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                <a href="#" className="text-[#7C3E8C] hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#7C3E8C] hover:underline">
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
            >
              Create Account
            </Button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
