const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithManyBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
      },
      {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
      },
      {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
      },
      {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
      }
]

test('dummy returns one', () => {
    const blogs = []
    assert.strictEqual(listHelper.dummy(blogs), 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '123',
            title: 'blogi',
            author: 'Meikä Mandoliini',
            url: 'http://www.meemi.info',
            likes: 321,
            __v: 0
        }
    ]

    test('when list has only one blog equals the likes of that', () => {
        assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 321)
    })
})

describe('favourite blog', () => {
    const blogWithMostLikes = listWithManyBlogs[2]
    test('is the one with the most likes', () => {
        assert.strictEqual(listHelper.favouriteBlog(listWithManyBlogs), blogWithMostLikes)
    })
})

describe('most blogs', () => {
    const authorWithMostBlogs = "Robert C. Martin"
    test('when the list has multiple blogs', () => {
        assert.strictEqual(listHelper.mostBlogs(listWithManyBlogs).author, authorWithMostBlogs)
    })
})

describe('most likes', () => {
    const authorWithMostLikes = "Edsger W. Dijkstra"
    test('when the list has multiple blogs', () => {
        assert.strictEqual(listHelper.mostLikes(listWithManyBlogs).author, authorWithMostLikes)
    })
})