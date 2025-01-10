import axios from 'axios'

interface DistanceResponse {
  distance: number // in kilometers
  duration: number // in minutes
}

export async function calculateGoogleDistance({
  originLat,
  originLng,
  destinationLat,
  destinationLng
}: {
  originLat: number
  originLng: number
  destinationLat: number
  destinationLng: number
}): Promise<DistanceResponse | null> {
  const apiKey = process.env.DISTANCE_MATRIX_API_KEY
  try {
    const response = await axios.get(
      `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destinationLat},${destinationLng}&key=${apiKey}`
    )
    const result = response.data
    console.log(result)
    if (
      result.rows?.[0]?.elements?.[0]?.status === 'OK' &&
      result.rows[0].elements[0].distance &&
      result.rows[0].elements[0].duration
    ) {
      return {
        distance: result.rows[0].elements[0].distance.value / 1000, // kilometers
        duration: result.rows[0].elements[0].duration.value / 60 //minutes
      }
    }
    return null
  } catch (error) {
    console.error('Google Distance Matrix API Error:', error)
    return null
  }
}
