// app/page.tsx
"use client"
export default function Home() {
  const fetchData = async () => {
    try {
      // GET request
      const res = await fetch('/api/proxy');
      const data = await res.json();
      console.log(data);

      // POST request
      const postRes = await fetch('/api/proxy', {
        method: 'POST',
        body: JSON.stringify({ key: 'value' })
      });
      const postData = await postRes.json();
      console.log(postData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Test Proxy</button>
    </div>
  );
}