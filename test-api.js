// Test API endpoints
const API_BASE_URL = 'http://localhost:3001/api';

async function testToggleStatus() {
  try {
    console.log('🧪 Testing toggle status API...');
    
    // Test GET accounts first
    console.log('\n1. Testing GET /api/accounts');
    const getResponse = await fetch(`${API_BASE_URL}/accounts`);
    const getResult = await getResponse.json();
    console.log('GET Response:', JSON.stringify(getResult, null, 2));
    
    if (getResult.success && getResult.data.length > 0) {
      const staffAccount = getResult.data.find(acc => acc.role === 'staff');
      if (staffAccount) {
        console.log('\n2. Found staff account:', staffAccount);
        
        // Test PUT status
        console.log('\n3. Testing PUT /api/accounts/:id/status');
        const putResponse = await fetch(`${API_BASE_URL}/accounts/${staffAccount.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'locked'
          })
        });
        
        const putResult = await putResponse.json();
        console.log('PUT Response:', JSON.stringify(putResult, null, 2));
        console.log('Status Code:', putResponse.status);
        
        if (putResult.success) {
          console.log('✅ Toggle status API works!');
          
          // Test GET again to see if status changed
          console.log('\n4. Testing GET again to verify change');
          const getResponse2 = await fetch(`${API_BASE_URL}/accounts`);
          const getResult2 = await getResponse2.json();
          console.log('GET Response after change:', JSON.stringify(getResult2, null, 2));
        } else {
          console.log('❌ Toggle status API failed:', putResult.error);
        }
      } else {
        console.log('❌ No staff account found');
      }
    } else {
      console.log('❌ Failed to get accounts');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testToggleStatus();