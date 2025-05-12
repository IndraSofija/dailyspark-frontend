// pages/index.tsx
import { useEffect, useState } from 'react';
import { getUserId } from '../utils/userId';

export default function Home() {
  const [spark, setSpark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Šie divi stāvoki nu tiek ielādēti useEffect iekšā
  const [userLevel, setUserLevel] = useState<'free' | 'basic' | 'pro'>('free');
  const [subscriptionLevel, setSubscriptionLevel] = useState<'free' | 'basic' | 'pro'>('free');

  const selectedNiche = 'I know better';

  useEffect(() => {
    // async funkcija, kas vienā izsaukumā ielādē userLevel un subscriptionLevel
    const init = async () => {
      // 1) userLevel no localStorage
      const stored = (localStorage.getItem('subscription_level') as 'free' | 'basic' | 'pro') || 'free';
      setUserLevel(stored);

      // 2) subscriptionLevel no backend
      const userId = getUserId();
      try {
        const resp = await fetch(
          `https://dailysparkclean-production-74eb.up.railway.app/user-info?user_id=${userId}`
        );
        const data = await resp.json();
        setSubscriptionLevel((data.subscription_level as any) || 'free');
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

    const userId = getUserId();
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

  // tagad pieņem plan tipu
  const handleUpgrade = async (plan: 'basic' | 'pro') => {
    const userId = getUserId();
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

      {/* Ģenerē dzirksteli */}
      <button
        onClick={generateSpark}
        style={{ marginTop: '20px' }}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Your Spark 🔥'}
      </button>

      {/* === ŠEIT SĀKAS “Upgrade” pogas === */}
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
            Jaunināt uz Basic 💳
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
            Jaunināt uz Pro 💳
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
            Jaunināt uz Pro 💳
          </button>
        </div>
      )}
      {/* === ŠEIT BEIDZAS “Upgrade” pogas === */}

      {/* Pro līmeņa arhīvs */}
      {subscriptionLevel === 'pro' && (
        <button
          onClick={() => (window.location.href = '/my-sparks')}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Skatīt manas dzirksteles 📜
        </button>
      )}

      {/* Rezultāts */}
      {spark && (
        <div
          style={{
            marginTop: '30px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <strong>Your Spark:</strong>
          <p>{spark}</p>
        </div>
      )}

      {/* Kļūdas logs */}
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

// Palīgfunkcija dzirksteļu saglabāšanai
const saveSpark = async (sparkText: string, userId: string) => {
  console.log('>>> Saglabāju Spark:', sparkText, 'User:', userId);
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
    console.error('Neizdevās saglabāt dzirksteli:', e);
  }
};
