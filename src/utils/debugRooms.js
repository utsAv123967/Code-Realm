// Debug script for checking available rooms
// Run this in browser console after going to Dashboard

(function() {
  console.log('🔍 Debugging Available Rooms...');
  
  // Check authentication
  if (!window.firebaseAuth) {
    console.error('❌ Firebase auth not available');
    return;
  }
  
  const currentUser = window.firebaseAuth.currentUser;
  if (!currentUser) {
    console.error('❌ User not logged in');
    return;
  }
  
  console.log('✅ Current user:', currentUser.uid, currentUser.email);
  
  // Check if room fetching function is available
  if (typeof window.checkAuth === 'function') {
    console.log('🔍 Running auth check...');
    window.checkAuth();
  }
  
  // Check firestore data directly
  if (window.firebaseDb) {
    console.log('🔍 Checking Firestore data...');
    
    // You can manually check rooms in console
    console.log('💡 To check rooms manually, run:');
    console.log('1. Open Network tab');
    console.log('2. Refresh dashboard');
    console.log('3. Look for Firestore requests');
    console.log('4. Check the "Join Room" tab in your dashboard');
  }
  
  console.log('✅ Debug script completed');
  console.log('📋 Next steps:');
  console.log('1. Go to Dashboard');
  console.log('2. Click "Join Room" tab');
  console.log('3. Check if rooms from other users appear');
  console.log('4. If no rooms appear, create test rooms with test users');
})();
