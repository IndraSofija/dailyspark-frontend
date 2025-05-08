import { useState } from 'react';

export default function Home() {
  const [spark, setSpark] = useState('');

  const generateSpark = async () => {
    const response = await fetch('https://dailysparkclean-production.up.railway.app/generate');
    const data = await response.json();
    setSpark(data.spark); // vai "message", ja backend atgriež { message: "..." }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to DailySpark</h1>
      <p>Your daily dose of inspirational content, made simple.</p>
      <button onClick={generateSpark} style={{ marginTop: '10px' }}>
        Generate Your Spark ✨
      </button>
      {spark && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <strong>Your Spark:</strong> {spark}
        </div>
      )}
    </div>
  );
}
