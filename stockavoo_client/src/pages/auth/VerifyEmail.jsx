import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVerifyEmailMutation } from '../../store/api/authApi';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const result = await verifyEmail(token).unwrap();
        setStatus('success');
        setMessage(result.message || 'Email verified successfully!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    handleVerification();
  }, [token, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {isLoading || status === 'verifying' ? (
          <>
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#7C3E8C] mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Email...
            </h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-2">
              <Link
                to="/login"
                className="block w-full px-4 py-2 bg-[#7C3E8C] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Go to Login
              </Link>
              <p className="text-sm text-gray-500">
                Need a new verification link? Login to resend.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
