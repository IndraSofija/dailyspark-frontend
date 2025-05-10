import { useState } from 'react';
import { getUserId } from '../utils/userId';

export default function Home() {
  const [spark, setSpark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selectedNiche = 'I know better';

  const generateSpark = async () => {
    setLoading(true);
    setError('');
    setSpark('');

    const userId = getUserId();

    try {
      const response = await fetch('https://dailysparkclean-production-74eb.up.railway.app/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche: selectedNiche,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (data.result) {
        setSpark(data.result);
        await saveSpark(data.result, userId);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('Unknown response format.');
      }
    } catch (err) {
      setError('Connection failed. Try again later.');
    }

    setLoading(false);
  };

  const handleUpgrade = async () => {
    const userId = getUserId();

    try {
      const response = await fetch("https://dailysparkclean-production-74eb.up.railway.app/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) throw new Error("Neizdevās izveidot Stripe sesiju");

      const data = await response.json();
      const checkoutUrl = data.checkout_url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert("Checkout URL nav atrasts.");
      }
    } catch (error) {
      console.error("Kļūda:", error);
      alert("Neizdevās izveidot maksājuma sesiju.");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to DailySpark ✨</h1>
      <p>Your daily dose of inspiration, one click away.</p>

      <button onClick={generateSpark} style={{ marginTop: '20px' }} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Your Spark 🔥'}
      </button>

      {/* 
      <button onClick={handleUpgrade} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#fbbf24', color: '#fff', borderRadius: '6px', border: 'none' }}>
        Jaunināt uz Basic vai Pro 💳
      </button>
      */}

      {spark && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <strong>Your Spark:</strong>
          <p>{spark}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid red', borderRadius: '8px', color: 'darkred' }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

const saveSpark = async (sparkText: string, userId: string) => {
  console.log(">>> Saglabāju Spark:", sparkText, "User:", userId);

  try {
    await fetch("https://dailysparkclean-production-74eb.up.railway.app/save-spark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        spark_text: sparkText,
      }),
    });
  } catch (error) {
    console.error("Neizdevās saglabāt dzirksteli:", error);
  }
};
