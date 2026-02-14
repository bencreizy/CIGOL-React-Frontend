/**
 * CIGOL LOCAL HANDSHAKE LAYER
 * Strictly for interaction with local, custom-trained model backends.
 * NO EXTERNAL APIS OR SDKS PERMITTED.
 */

const LOCAL_CONFIG = {
  ENDPOINT: "http://localhost:8000/api/chat",
};

/**
 * Handshake interface for custom local model.
 * Now includes a category parameter to route requests to specific designated repositories.
 */
export async function sendMessageToModel(
  text: string, 
  base64Image?: string | null,
  category: string = "Science"
): Promise<string> {
  
  try {
    const response = await fetch(LOCAL_CONFIG.ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: text,
        image: base64Image ? base64Image.split(',')[1] || base64Image : null,
        timestamp: new Date().toISOString(),
        context: category // Links the interaction to the specific repository mode
      })
    });

    if (!response.ok) {
      throw new Error(`Local Server Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response || data.text || `Output received from local model [${category} Context].`;

  } catch (error: any) {
    console.warn(`Local handshake standby [${category}]:`, error.message);
    return `[LOCAL MODEL STANDBY - ${category.toUpperCase()} MODE]\n\nHandshake ready at: ${LOCAL_CONFIG.ENDPOINT}\n\nWaiting for your custom model server to accept the data stream from the ${category} repository...`;
  }
}