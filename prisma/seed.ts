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

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password_here',
      userRoles: {
        create: {
          role: {
            connect: {
              name: 'ADMIN'
            }
          }
        }
      }
    }
  })

  const categories = [
    {
      name: 'Blood Donation',
      slug: 'blood-donation',
      description: 'Articles about blood donation awareness and processes'
    },
    {
      name: 'Health Tips',
      slug: 'health-tips',
      description: 'General health and wellness advice'
    },
    {
      name: 'Success Stories',
      slug: 'success-stories',
      description: 'Stories from blood donors and recipients'
    }
  ]

  for (const category of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  const posts = [
    {
      title: 'The Importance of Regular Blood Donation',
      slug: 'importance-of-regular-blood-donation',
      content: `Blood donation is a crucial lifesaving process that helps countless patients every day. 
                Regular blood donation ensures that blood banks maintain adequate supplies for emergencies 
                and planned medical procedures...`,
      excerpt:
        'Learn why regular blood donation is important and how it saves lives.',
      featuredImage: 'https://example.com/images/blood-donation.jpg',
      published: true,
      authorId: adminUser.id,
      categories: {
        create: [
          {
            category: {
              connect: {
                slug: 'blood-donation'
              }
            }
          }
        ]
      }
    },
    {
      title: 'Preparing for Your First Blood Donation',
      slug: 'preparing-for-first-blood-donation',
      content: `If you're planning to donate blood for the first time, it's natural to have questions 
                and concerns. Here's everything you need to know to prepare for your first donation...`,
      excerpt: 'A comprehensive guide for first-time blood donors.',
      featuredImage: 'https://example.com/images/first-donation.jpg',
      published: true,
      authorId: adminUser.id,
      categories: {
        create: [
          {
            category: {
              connect: {
                slug: 'blood-donation'
              }
            }
          },
          {
            category: {
              connect: {
                slug: 'health-tips'
              }
            }
          }
        ]
      }
    }
  ]

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post
    })
  }

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
