import Image from 'next/image'

const BlogsPage = async () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {blogPosts.map((blog) => (
            <div key={blog.id} className="mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover w-full h-[200px]"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                      {blog.category}
                    </span>
                    <span className="text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{blog.title}</h2>
                  <p className="text-gray-600">{blog.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between py-2 border-b border-gray-200"
              >
                <span>{category.name}</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                  {category.count}
                </span>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm cursor-pointer hover:bg-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogsPage

// src/data/blogData.ts

export const blogPosts = [
  {
    id: '1',
    title: 'Why Blood Donation Is The Most Noble Act Of Kindness',
    slug: 'why-blood-donation-is-noble',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...',
    excerpt:
      'Discover why blood donation is considered one of the most impactful ways to help others and save lives...',
    featuredImage: '/images/blood-donation-hero.jpg',
    published: true,
    authorId: 'author1',
    createdAt: '2024-03-27T10:00:00Z',
    category: 'DONATION'
  },
  {
    id: '2',
    title: 'Understanding Blood Types: A Complete Guide',
    slug: 'blood-types-guide',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...',
    excerpt:
      'Learn about different blood types, compatibility, and why knowing your blood type is crucial...',
    featuredImage: '/images/blood-types.jpg',
    published: true,
    authorId: 'author2',
    createdAt: '2024-03-27T09:00:00Z',
    category: 'EDUCATION'
  },
  {
    id: '3',
    title: 'Common Myths About Blood Donation Debunked',
    slug: 'blood-donation-myths',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...',
    excerpt:
      'We address and debunk common misconceptions about blood donation to help you make informed decisions...',
    featuredImage: '/images/myths.jpg',
    published: true,
    authorId: 'author1',
    createdAt: '2024-03-27T08:00:00Z',
    category: 'AWARENESS'
  }
]

export const categories = [
  {
    id: '1',
    name: 'Blood Donation',
    slug: 'blood-donation',
    count: 340
  },
  {
    id: '2',
    name: 'Health Tips',
    slug: 'health-tips',
    count: 74
  },
  {
    id: '3',
    name: 'Medical News',
    slug: 'medical-news',
    count: 41
  },
  {
    id: '4',
    name: 'Awareness',
    slug: 'awareness',
    count: 35
  }
]

export const tags = [
  'Health',
  'Blood Types',
  'Donation',
  'Medical',
  'Awareness',
  'Community',
  'Healthcare',
  'Volunteers'
]
