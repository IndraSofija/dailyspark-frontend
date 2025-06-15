import { useEffect, useState } from 'react';
import { getUserId } from '../utils/userId';
import SparkHistory from '../components/SparkHistory';

export default function Home() {
  const [spark, setSpark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLevel, setUserLevel] = useState<'free' | 'basic' | 'pro'>('free');
  const [subscriptionLevel, setSubscriptionLevel] = useState<'free' | 'basic' | 'pro'>('free');
  const [header, setHeader] = useState('');

  const selectedNiche = 'I know better';
  const userId = getUserId();

  useEffect(() => {
    const sparkHeaders = [
      "Here’s your spark for today.",
      "Take a breath. This one’s for you.",
      "Today’s spark – quiet but powerful.",
      "Let this spark find you.",
      "A little something to nudge your day.",
      "Not loud. Just true.",
      "One thought. One flame.",
      "It’s waiting. Let it land.",
      "A spark, not a shout.",
      "This one chose you."
    ];
    const random = Math.floor(Math.random() * sparkHeaders.length);
    setHeader(sparkHeaders[random]);

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
        console.error('Failed to load subscription level:', e);
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
      if (!resp.ok) throw new Error('Failed to create Stripe session');
      const data = await resp.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('Checkout URL not found.');
      }
    } catch (e) {
      console.error('Error:', e);
      alert('Could not start checkout session.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to DailySpark ✨</h1>
      <p>Your daily dose of inspiration, one click away.</p>

      {subscriptionLevel === 'free' && (
        <p style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>
          🟢 You’re receiving a daily spark from a random niche.
        </p>
      )}

      <button
        onClick={generateSpark}
        style={{ marginTop: '20px' }}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Your Spark 🔥'}
      </button>

      {spark && (
        <div style={{ marginTop: '30px' }}>
          <h2>{header}</h2>
          <div
            style={{
              marginTop: '10px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <p>{spark}</p>
          </div>
        </div>
      )}

      {userLevel === 'free' && (
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleUpgrade('basic')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#fbbf24',
              color: '#fff',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Upgrade to Basic 💳
          </button>
          <button
            onClick={() => handleUpgrade('pro')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: '#fff',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Upgrade to Pro 💳
          </button>
        </div>
      )}

      {userLevel === 'basic' && (
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={() => handleUpgrade('pro')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: '#fff',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Upgrade to Pro 💳
          </button>
        </div>
      )}

      {subscriptionLevel === 'pro' && (
        <div style={{ marginTop: '30px' }}>
          <SparkHistory userId={userId} />
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '30px',
            padding: '15px',
            border: '1px solid red',
            borderRadius: '8px',
            color: 'darkred',
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

const saveSpark = async (sparkText: string, userId: string) => {
  console.log('>>> Saving spark:', sparkText, 'User:', userId);
  try {
    await fetch(
      'https://dailysparkclean-production-74eb.up.railway.app/save-spark',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, spark_text: sparkText }),
      }
    );
  } catch (e) {
    console.error('Failed to save spark:', e);
  }
};
