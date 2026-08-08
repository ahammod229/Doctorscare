(async () => {
  try {
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ahammod229@gmail.com', password: 'password123' })
    });
    const user = await loginRes.json();
    console.log('Login:', loginRes.status, user.id);

    const res = await fetch('http://localhost:3000/api/patient/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id },
      body: JSON.stringify({
         patientId: user.id,
         fileName: 'test.png',
         fileType: 'image/png',
         fileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' 
      })
    });
    console.log('Upload:', res.status, await res.text());
  } catch(e) { console.error(e) }
})();
