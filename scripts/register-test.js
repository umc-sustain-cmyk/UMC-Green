(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Auto',
        lastName: 'Tester',
        email: 'auto.tester@crk.umn.edu',
        password: 'AutoPass123!',
        studentId: 'AUTO001',
        phone: '218-555-9999',
        role: 'student'
      })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(2);
  }
})();
