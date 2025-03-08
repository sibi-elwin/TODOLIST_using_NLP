import axios from 'axios'


export const getTaskAnalysis = async (title, description) => {
  try {
    const response = await axios.post('http://localhost:3000/api/ai/api/analyze', {
      title,
      description,
    })
    
    // Log the response to debug
    console.log('AI Service Response:', response.data)
    
    return response.data
  } catch (error) {
    console.error('AI Analysis Error:', error)
    throw error
  }
}

export const checkAIServiceHealth = async () => {
  try {
    const response = await axios.get('http://localhost:5005/health')
    return response.data.status === 'healthy'
  } catch (error) {
    console.error('AI Service Health Check Failed:', error)
    return false
  }
} 