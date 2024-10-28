const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
      },
      {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
      },
      {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
      },
      {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
      }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[2])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[3])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[4])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[5])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('GET returns the correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body)
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('identification field of blogs is called "id"', async () => {
    const response = await api.get('/api/blogs')

    // checks if every blog element has an field called 'id'
    let ids = []
    response.body.forEach(blog => {
        if (blog.id !== undefined) {
            ids.push(blog.id)
        } else {
            console.error('no id in returnedObject')
        }
    });
    assert.strictEqual(ids.length, initialBlogs.length)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Pöhinä Kerroin",
        author: "Leppis Komitea",
        url: "http://www.klusteri.network/",
        likes: "42"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('Pöhinä Kerroin'))
})

test('likes defaults to 0', async () => {
    const newBlog = {
        title: "Pöhinä",
        author: "Leppätalokomitea",
        url: "http://www.klusteri.network/"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const addedBlog = response.body.find(blog => blog.title === 'Pöhinä')
    assert.strictEqual(addedBlog.likes, 0)
})

describe('POST method with missing:', () => {
    test('title responds with status code 400', async () => {
        const blogWithoutTitle = {
            author: "Leppis Komitea",
            url: "http://www.klusteri.network/",
            likes: "42"
        }
    await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)
    })

    test('url responds with status code 400', async () => {
        const blogWithoutURL = {
            title: "Pöhinä Kerroin",
            author: "Leppis Komitea",
            likes: "42"
        }
    await api
        .post('/api/blogs')
        .send(blogWithoutURL)
        .expect(400)
    })
})

describe('deletion', () => {
    test('responds with status code 204 on valid id', async () => {
        const response = await api.get('/api/blogs')
        const id = response.body[0].id
        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)
    })

    test('responds with 400 on invalid id', async () => {
        const id = 'qwertyu'
        await api
            .delete(`/api/blogs/${id}`)
            .expect(400)
    })
})

describe('updating a blog', () => {
    test('responds with status code 200 on valid input', async () => {
        const newBlog = {
            title: "Pöhinä",
            author: "Leppätalokomitea",
            url: "http://www.klusteri.network/",
            likes: "42"
        }
        const response = await api.get('/api/blogs')
        const id = response.body[0].id
        await api
            .put(`/api/blogs/${id}`)
            .send(newBlog)
            .expect(200)
    })

    test('responds with status code 400 on missing title', async () => {
        const newBlog = {
            author: "Leppätalokomitea",
            url: "http://www.klusteri.network/",
            likes: "42"
        }
        const response = await api.get('/api/blogs')
        const id = response.body[0].id
        await api
            .put(`/api/blogs/${id}`)
            .send(newBlog)
            .expect(400)
    })

    test('responds with status code 400 on missing url', async () => {
        const newBlog = {
            title: "Pöhinä",
            author: "Leppätalokomitea",
            likes: "42"
        }
        const response = await api.get('/api/blogs')
        const id = response.body[0].id
        await api
            .put(`/api/blogs/${id}`)
            .send(newBlog)
            .expect(400)
    })
})

after(async () => {
    mongoose.connection.close()
})