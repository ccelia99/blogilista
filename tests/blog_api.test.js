const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/note')


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

test('a valid blog can be added ', async () => {
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

afterAll(() => {
  mongoose.connection.close()
})