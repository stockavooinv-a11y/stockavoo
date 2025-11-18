import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';

/**
 * OAuth Callback Handler
 *
 * This component handles the redirect from Google OAuth
 * It extracts the token from URL and stores it in Redux + localStorage
 */
const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL parameter
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        // OAuth failed
        console.error('OAuth error:', error);
        navigate('/login?error=oauth_failed');
        return;
      }

      if (!token) {
        // No token found
        navigate('/login?error=no_token');
        return;
      }

      try {
        // Fetch user data with the token
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        // Store credentials in Redux (which also saves to localStorage)
        dispatch(setCredentials({
          user: data.data.user,
          token: token
        }));

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to authenticate:', error);
        navigate('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3E8C] mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
