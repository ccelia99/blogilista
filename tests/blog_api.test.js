const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/note')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})  
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a field specifying a blog is named as id', async () => {
    const response = await helper.blogsInDb()
    response.forEach(item => expect(item.id).toBeDefined())
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data ', async () => {
      const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5    
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      
      const titles = blogsAtEnd.map(n => n.title)
      expect(titles).toContain(
        'async/await simplifies making async calls'
      )
    })
  })

  test('a blog with undefined likes will be set as 0 likes', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()  
    const likesValue = blogsAtEnd[blogsAtEnd.length-1].likes
    console.log('likesValue', likesValue)
    expect(likesValue).toBe(0)  
  })

  test('fails with statuscode 404 if title does not exist', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5 
    }

    await api
      .post('/api/notes')
      .send(newBlog)
      .expect(404)

    const blogsAtEnd  = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with statuscode 404 if url does not exist', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Edsger W. Dijkstra',
      likes: 5 
    }

    await api
      .post('/api/notes')
      .send(newBlog)
      .expect(404)

    const blogsAtEnd  = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
    
        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
        )
    
        const titles = blogsAtEnd.map(r => r.title)
    
        expect(titles).not.toContain(blogToDelete.title)
    })
  })
})


afterAll(() => {
  mongoose.connection.close()
})