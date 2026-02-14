// CIGOL-React-Frontend/src/api/handshake.js


const API_BASE_URL = "http://localhost:5000"; // Adjust to your backend port


export const performHandshake = async (activeButtonId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/handshake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        session_id: Date.now(),
        mode: activeButtonId, // Dedicates the app to this button's logic
        sync_ratio: 1.618 
      }),
    });


    if (!response.ok) throw new Error('Handshake Failed');
    
    const data = await response.json();
    console.log("Handshake Secured:", data.status);
    return data;
  } catch (error) {
    console.error("Link Error:", error);
    return null;
  }
};