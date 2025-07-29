// Room Access Test Script
// Run this in browser console after creating rooms

(function() {
  console.log('🏠 Room Access Control Test');
  
  // Check if user is logged in
  if (!window.firebaseAuth?.currentUser) {
    console.error('❌ User not logged in. Please log in first.');
    return;
  }
  
  const currentUser = window.firebaseAuth.currentUser;
  console.log('✅ Current user:', currentUser.uid, currentUser.email);
  
  // Instructions for testing
  console.log('🧪 Testing Steps:');
  console.log('1. Create a room from Dashboard');
  console.log('2. Click "Enter" button on the room card');
  console.log('3. Should navigate to /rooms/{roomId}');
  console.log('4. Should show room interface if you have access');
  console.log('5. Should show "Access Denied" if you don\'t have access');
  
  console.log('');
  console.log('🔐 Access Control Rules:');
  console.log('✅ Room creator can always access');
  console.log('✅ Users in the room\'s Users array can access');
  console.log('❌ Other users cannot access');
  
  console.log('');
  console.log('🌟 To test access control:');
  console.log('1. Copy a room URL from browser address bar');
  console.log('2. Log out and log in as different user');
  console.log('3. Try to access the copied URL');
  console.log('4. Should be denied access');
  
  // Test URL format
  if (window.location.pathname.includes('/rooms/')) {
    const roomId = window.location.pathname.split('/rooms/')[1];
    console.log('🏠 Currently viewing room:', roomId);
  }
  
})();
