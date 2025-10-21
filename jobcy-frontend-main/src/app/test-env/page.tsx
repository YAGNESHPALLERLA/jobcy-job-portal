export default function TestEnv() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Test - Updated</h1>
      <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
      <p><strong>NEXT_PUBLIC_SOCKET_URL:</strong> {process.env.NEXT_PUBLIC_SOCKET_URL || 'NOT SET'}</p>
      <p><strong>Login URL would be:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}/login</p>
      <p><strong>Build Time:</strong> {new Date().toISOString()}</p>
    </div>
  );
}
