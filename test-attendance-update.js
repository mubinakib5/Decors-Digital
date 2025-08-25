// Test script to debug attendance update issue
// Using built-in fetch (Node.js 18+)

async function testAttendanceUpdate() {
  try {
    // First, let's get all attendance records to see what's in the database
    console.log('Fetching all attendance records...');
    const getResponse = await fetch('http://localhost:3000/api/admin/attendance');
    const attendanceData = await getResponse.json();
    console.log('Attendance records:', JSON.stringify(attendanceData, null, 2));
    
    if (attendanceData.length > 0) {
      const firstRecord = attendanceData[0];
      console.log('\nTesting update with first record:', firstRecord);
      
      // Try to update the first record
      const updateData = {
        employeeId: firstRecord.employeeId,
        date: firstRecord.date,
        clockIn: firstRecord.clockIn,
        clockOut: firstRecord.clockOut,
        status: 'on time'
      };
      
      console.log('Sending PUT request with data:', updateData);
      
      const putResponse = await fetch('http://localhost:3000/api/admin/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      const result = await putResponse.text();
      console.log('PUT response status:', putResponse.status);
      console.log('PUT response:', result);
    } else {
      console.log('No attendance records found in database');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAttendanceUpdate();