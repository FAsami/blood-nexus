import { prismaClient } from '@/lib/prismaClient'
import { BloodGroup } from '@prisma/client'
import { calculateGoogleDistance } from './calculateGoogleDistance'

interface NearbyDonor {
  id: string
  phone: string | null
  name: string | null
  distance?: number
  duration?: number
}

export async function findNearbyDonors({
  bloodGroup,
  latitude,
  longitude,
  maxDistance = 20,
  limit = 3
}: {
  bloodGroup: BloodGroup
  latitude: number
  longitude: number
  maxDistance?: number
  limit?: number
}): Promise<NearbyDonor[]> {
  console.log(bloodGroup)
  const donors = await prismaClient.user.findMany({
    where: {
      // bloodGroup,
      // isAvailableForDonation: true,
      // isActive: true,
      // lastDonatedOn: {
      //   lte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      // }
      // address: {
      //   latitude: { not: null },
      //   longitude: { not: null }
      // }
    },
    select: {
      id: true,
      phone: true,
      name: true,
      address: {
        select: {
          latitude: true,
          longitude: true
        }
      }
    }
  })
  console.log('donors', donors)
  return donors

  const donorsWithDistance = await Promise.all(
    donors.map(async (donor) => {
      if (!donor.address?.latitude || !donor.address?.longitude) {
        return null
      }

      const distanceInfo = await calculateGoogleDistance({
        originLat: latitude,
        originLng: longitude,
        destinationLat: donor.address.latitude,
        destinationLng: donor.address.longitude
      })

      if (!distanceInfo || distanceInfo.distance > maxDistance) {
        return null
      }

      return {
        id: donor.id,
        phone: donor.phone,
        name: donor.name,
        distance: distanceInfo.distance,
        duration: distanceInfo.duration
      }
    })
  )

  return donorsWithDistance
    .filter((donor): donor is NonNullable<typeof donor> => donor !== null)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, limit)
}
