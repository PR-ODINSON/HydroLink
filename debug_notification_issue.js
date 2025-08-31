#!/usr/bin/env node

// Debug script to check notification flow
console.log('🔍 DEBUGGING NOTIFICATION ISSUE\n');

console.log('📊 From the server logs, I can see:');
console.log('✅ Purchase request was created successfully');
console.log('👤 Buyer: Shantanu (68b325c97f5a2246e4cb868c)');
console.log('🏭 Producer: Test Producer (68b33454135fdcb279a86644)');
console.log('💰 Credit: HC-202508-RT6G9-459087 (750 MWh)');
console.log('');

console.log('❌ But when you login as:');
console.log('👤 Producer: Nirmal Joshi (68b315cd8ed984e6a87936f1)');
console.log('📊 Found 4 total notifications for producer');
console.log('🛒 Purchase request notifications: 0');
console.log('');

console.log('🎯 THE PROBLEM:');
console.log('The notification was sent to "Test Producer" but you are logged in as "Nirmal Joshi"');
console.log('These are DIFFERENT users!');
console.log('');

console.log('✅ SOLUTION:');
console.log('1. Login as "Test Producer" (the one who owns the credit)');
console.log('2. OR create a new credit as "Nirmal Joshi" and test with that');
console.log('');

console.log('🧪 TO TEST PROPERLY:');
console.log('1. Login as Nirmal Joshi (Producer)');
console.log('2. Create a new credit in producer dashboard');
console.log('3. Logout and login as buyer');
console.log('4. Send purchase request for Nirmal\'s credit');
console.log('5. Logout and login as Nirmal Joshi again');
console.log('6. Check notifications - should see the request!');
