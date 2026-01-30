import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useResendVerificationMutation } from '../../store/api/authApi';
import { Button } from '../../components/common';
import { Package, Mail, Clock, CheckCircle } from 'lucide-react';

const VerificationWaiting = () => {
  const user = useSelector(selectCurrentUser);
  const [resendVerification, { isLoading }] = useResendVerificationMutation();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleResendEmail = async () => {
    try {
      const result = await resendVerification(user?.email).unwrap();
      setMessageType('success');
      setMessage(result.message || 'Verification email sent successfully!');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('error');
      setMessage(error.message || 'Failed to send verification email.');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#4A1D66] to-[#7C3E8C] rounded-xl flex items-center justify-center shadow-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Stockavoo</h1>
          </div>
          <p className="text-sm text-slate-600">Inventory Management</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-8 md:p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
            <Mail className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Verify Your Email
          </h2>

          <p className="text-slate-600 mb-2">
            We've sent a verification email to
          </p>
          <p className="font-semibold text-slate-900 mb-6 text-lg">{user?.email}</p>

          <p className="text-slate-600 mb-8">
            Please check your inbox and click the verification link to access your dashboard.
            If you don't see the email, check your spam folder.
          </p>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'bg-red-50 border-l-4 border-red-500 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <Clock className="w-6 h-6 text-[#7C3E8C] mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700 mb-1">Check Spam</p>
              <p className="text-xs text-slate-500">Email might be in spam folder</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <Mail className="w-6 h-6 text-[#7C3E8C] mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700 mb-1">Valid for 24hrs</p>
              <p className="text-xs text-slate-500">Link expires after 24 hours</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle className="w-6 h-6 text-[#7C3E8C] mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700 mb-1">One Click</p>
              <p className="text-xs text-slate-500">Just click the link in email</p>
            </div>
          </div>

          {/* Resend Button */}
          <Button
            onClick={handleResendEmail}
            isLoading={isLoading}
            variant="outline"
            className="mx-auto"
          >
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Resend Verification Email
            </span>
          </Button>

          <p className="text-sm text-slate-500 mt-6">
            Need help? Contact support at support@stockavoo.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationWaiting;
