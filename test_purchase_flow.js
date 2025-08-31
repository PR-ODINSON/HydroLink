#!/usr/bin/env node

// Test script to verify the purchase request flow
console.log('🔧 Testing Purchase Request Flow...\n');

// Test checklist
const tests = [
  {
    name: 'Server Connection',
    test: async () => {
      try {
        const response = await fetch('http://localhost:3000/api/test');
        return response.status === 200;
      } catch (error) {
        return false;
      }
    }
  },
  {
    name: 'Frontend Connection',
    test: async () => {
      try {
        const response = await fetch('http://localhost:5173');
        return response.status === 200;
      } catch (error) {
        return false;
      }
    }
  }
];

async function runTests() {
  console.log('📋 Pre-flight Tests:\n');

  for (const test of tests) {
    const result = await test.test();
    const status = result ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${result ? 'PASS' : 'FAIL'}`);
  }

  console.log('\n🚀 Manual Testing Steps:\n');
  console.log('1. Open browser and go to http://localhost:5173');
  console.log('2. Login as a Buyer user');
  console.log('3. Go to Dashboard');
  console.log('4. Click "Register to Purchase" on any credit');
  console.log('5. Click "Send Request"');
  console.log('6. Check browser console for logs:');
  console.log('   - 🛒 BUYER: Sending purchase request...');
  console.log('   - ✅ BUYER: Purchase request sent successfully!');
  console.log('   - 🔔 BUYER: Now the producer should see notification!');
  console.log('');
  console.log('7. Login as the Producer who owns that credit');
  console.log('8. Check notification bell in navbar');
  console.log('9. Open notification center - should show purchase request');
  console.log('10. Check producer dashboard - should show purchase requests section');
  console.log('');
  console.log('🔍 Expected Server Console Logs:');
  console.log('   - 🔔 Creating notification for producer...');
  console.log('   - ✅ Notification created successfully with ID:...');
  console.log('   - 🔔 Producer [name] checking notifications...');
  console.log('   - 🛒 Purchase request notifications: X');
  console.log('');
  console.log('🎯 If everything works, you should see:');
  console.log('   - Success alert: "✅ REQUEST SENT! ✅"');
  console.log('   - Notification bell shows unread count');
  console.log('   - Producer dashboard shows purchase request');
  console.log('   - Producer can click Accept/Reject');
}

runTests();
