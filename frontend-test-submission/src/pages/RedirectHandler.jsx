import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { log } from '../middleware/logger';

const RedirectHandler = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) return;

    const item = localStorage.getItem(code);
    if (!item) {
      log('frontend', 'warn', 'component', `Shortcode not found: ${code}`);
      alert('Short URL not found. Redirecting to homepage...');
      navigate('/');
      return;
    }

    try {
      const data = JSON.parse(item);
      const expiry = new Date(data.expiry);
      const now = new Date();

      if (now <= expiry) {
        log('frontend', 'info', 'component', `Redirecting to ${data.longUrl}`);
        window.location.href = data.longUrl;
      } else {
        log('frontend', 'warn', 'component', `Link expired: ${code}`);
        alert('This short link has expired.');
        navigate('/');
      }
    } catch (err) {
      log('frontend', 'error', 'component', `JSON parse error for code: ${code}`);
      navigate('/');
    }
  }, [code, navigate]);

  return null;
};

export default RedirectHandler;