import { useState } from 'react';

export default function Home() {
  const [spark, setSpark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSpark = async () => {
    setLoading(true);
    setError('');
    setSpark('');

    try {
      const response = await fetch('https://dailysparkclean-production-74eb.up.railway.app/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Generate one short inspirational sentence.",
        }),
      });

      const data = await response.json();

      if (data.result) {
        setSpark(data.result);
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

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to DailySpark ✨</h1>
      <p>Your daily dose of inspiration, one click away.</p>
      <button onClick={generateSpark} style={{ marginTop: '20px' }} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Your Spark 🔥'}
      </button>

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
