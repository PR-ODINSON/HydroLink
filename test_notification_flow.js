#!/usr/bin/env node

// Quick test script to debug notification flow
const axios = require('axios');

async function testNotificationFlow() {
  console.log('🔧 Testing Purchase Request Notification Flow...\n');

  try {
    // 1. Test if we can reach the server
    const serverTest = await axios.get('http://localhost:3001/api/test', { timeout: 5000 });
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running on port 3001');
    console.log('Please start the server with: cd server && npm start');
    return;
  }

  // Test steps for debugging:
  console.log('\n📋 Debug Steps to Test Manually:');
  console.log('1. Login as a Buyer user');
  console.log('2. Go to Buyer Dashboard');
  console.log('3. Click "Register to Purchase" on any credit');
  console.log('4. Click "Send Request"');
  console.log('5. Check browser console for logs');
  console.log('6. Login as the Producer who owns that credit');
  console.log('7. Check notification bell in navbar');
  console.log('8. Check producer dashboard for purchase requests section');
  
  console.log('\n🔍 Check these logs in server console:');
  console.log('- "🔔 Creating notification for producer..."');
  console.log('- "✅ Notification created successfully with ID:"');
  console.log('- "🔔 Producer [name] checking notifications..."');
  console.log('- "🛒 Purchase request notifications: [count]"');
}

testNotificationFlow();
