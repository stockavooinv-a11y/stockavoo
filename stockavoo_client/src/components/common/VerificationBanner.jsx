import { useState } from 'react';
import { useResendVerificationMutation } from '../../store/api/authApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';

const VerificationBanner = () => {
  const user = useSelector(selectCurrentUser);
  const [resendVerification, { isLoading }] = useResendVerificationMutation();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Don't show banner if user is verified or doesn't exist
  if (!user || user.isVerified) {
    return null;
  }

  const handleResendEmail = async () => {
    try {
      setMessage('');
      setMessageType('');

      const result = await resendVerification(user.email).unwrap();

      setMessage(result.message || 'Verification email sent successfully!');
      setMessageType('success');

      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.message || 'Failed to send verification email. Please try again.');
      setMessageType('error');

      // Clear error message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Email not verified.</span> Please check your inbox for a verification email.
          </p>

          {message && (
            <p className={`text-sm mt-2 ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {message}
            </p>
          )}

          <div className="mt-2">
            <button
              onClick={handleResendEmail}
              disabled={isLoading}
              className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;
