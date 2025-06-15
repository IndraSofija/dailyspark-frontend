import { useEffect, useState } from 'react';

export default function SparkHistory({ userId }: { userId: string }) {
  const [history, setHistory] = useState<{ text: string; date: string }[]>([]);

  useEffect(() => {
    fetch(`https://dailysparkclean-production-74eb.up.railway.app/user/sparks?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, [userId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nokopēts!");
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Manas dzirksteles 📜</h2>
      {history.length === 0 ? (
        <p style={{ marginTop: '10px', color: '#777' }}>Vēl nav nevienas dzirksteles.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {history.map((spark, index) => (
            <li
              key={index}
              style={{
                marginBottom: '12px',
                padding: '10px',
                border: '1px solid #eee',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: '12px',
              }}
            >
              <div>
                <p style={{ margin: 0 }}>{spark.text}</p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                  {spark.date}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(spark.text)}
                style={{
                  padding: '6px 10px',
                  fontSize: '12px',
                  backgroundColor: '#eee',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Kopēt
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
