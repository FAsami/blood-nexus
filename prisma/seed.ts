import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'Default user role'
    }
  })

  await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator role'
    }
  })

  await prisma.organization.upsert({
    where: { name: 'Default Organization' },
    update: {},
    create: {
      name: 'Default Organization',
      slug: 'default-organization',
      description: 'This is the default organization.',
      logoUrl: 'https://example.com/logo.png',
      faviconUrl: 'https://example.com/favicon.ico',
      seo: {
        title: 'Default Organization',
        description: 'Default organization description for SEO',
        keywords: ['default', 'organization'],
        ogImage: 'https://example.com/og-image.png',
        twitterCard: 'summary_large_image'
      },
      theme: {
        colors: {
          primary: '#000000',
          secondary: '#ffffff'
        },
        typography: {
          primaryFont: 'Inter',
          secondaryFont: 'Roboto'
        }
      },
      settings: {
        authentication: {
          methods: ['email', 'google'],
          mfa: {
            enabled: true,
            methods: ['authenticator']
          }
        },
        features: {
          blog: true,
          newsletter: false
        }
      }
    }
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
