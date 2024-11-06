const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const helper = require('./test_helper')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcryptjs')

const api = supertest(app)

describe('when there is initially one user in database', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('141414', 10)
      const user = new User({ username: 'root', passwordHash, name: 'Superuser'})
  
      await user.save()
    })

    test('user creation succeeds with valid user', async () => {
        const initialUsers = await helper.usersInDb()
        console.log("initial response users", initialUsers)

        const newUser = { username: 'uusi', password: 'sekret', name: 'käyttäjä'}

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(initialUsers.length + 1, usersAtEnd.length)

        const usernames = usersAtEnd.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    describe('user creation fails and responds with a correct status code when', () => {
        test('username is already taken', async () => {
            const initialUsers = await helper.usersInDb()

            const invalidUser = { username: 'root', password: '141414', name: 'kalle'}

            const result = await api
                .post('/api/users')
                .send(invalidUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            
            assert(result.body.error.includes('expected `username` to be unique'))
            assert.strictEqual(initialUsers.length, usersAtEnd.length)
        })

        test('password is too short', async () => {
            const initialUsers = await helper.usersInDb()

            const invalidUser = { username: 'uniqueUsername', password: '141', name: 'pekka'}

            const result = await api
                .post('/api/users')
                .send(invalidUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()

            assert(result.body.error.includes('password length must be greater than 3'))
            assert.strictEqual(initialUsers.length, usersAtEnd.length)
        })
    })
})

after(async () => {
    mongoose.connection.close()
})