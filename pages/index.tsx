import { useEffect, useState } from 'react';
import { getUserId } from '../utils/userId';
import SparkHistory from '../components/SparkHistory';

export default function Home() {
  const [spark, setSpark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLevel, setUserLevel] = useState<'free' | 'basic' | 'pro'>('free');
  const [subscriptionLevel, setSubscriptionLevel] = useState<'free' | 'basic' | 'pro'>('free');

  const selectedNiche = 'I know better';
  const userId = getUserId();

  useEffect(() => {
    const init = async () => {
      const stored = (localStorage.getItem('subscription_level') as 'free' | 'basic' | 'pro') || 'free';
      setUserLevel(stored);

      try {
        const resp = await fetch(
          `https://dailysparkclean-production-74eb.up.railway.app/user-info?user_id=${userId}`
        );
        const data = await resp.json();
        const level = (data.subscription_level as any) || 'free';
        setSubscriptionLevel(level);
      } catch (e) {
        console.error('Neizdevās ielādēt subscription level:', e);
        setSubscriptionLevel('free');
      }
    };

    init();
  }, []);

  const generateSpark = async () => {
    setLoading(true);
    setError('');
    setSpark('');

    try {
      const resp = await fetch(
        'https://dailysparkclean-production-74eb.up.railway.app/generate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ niche: selectedNiche, user_id: userId }),
        }
      );
      const data = await resp.json();
      if (data.result) {
        setSpark(data.result);
        await saveSpark(data.result, userId);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('Unknown response format.');
      }
    } catch {
      setError('Connection failed. Try again later.');
    }

    setLoading(false);
  };

  const handleUpgrade = async (plan: 'basic' | 'pro') => {
    try {
      const resp = await fetch(
        'https://dailysparkclean-production-74eb.up.railway.app/create-checkout-session',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, plan }),
        }
      );
      if (!resp.ok) throw new Error('Neizdevās izveidot Stripe sesiju');
      const data = await resp.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('Checkout URL nav atrasts.');
      }
    } catch (e) {
      console.error('Kļūda:', e);
      alert('Neizdevās izveidot maksājuma sesiju.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to DailySpark ✨</h1>
      <p>Your daily dose of inspiration, one click away.</p>

      {/* ✅ Teksts free lietotājam */}
      {subscriptionLevel === 'free' && (
        <p style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>
          🟢 Tava šodienas dzirkstele ir no nišas: <em>I know better</em>
        </p>
      )}

      <button
        onClick={generateSpark}
        style={{ marginTop: '20px' }}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Your Spark 🔥'}
      </button>

      {/* === Upgrade pogas === */}
      {userLevel === 'free' && (
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleUpgrade('basic')}
            style={{
              padding: '10px 20px',
              backgr
