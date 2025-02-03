const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (req, res) => {
    const users = await User
        .find({})
        .populate('blogs', {url: 1, title: 1, author: 1})
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { username, password, name } = req.body

    if (password.length <= 3) {
        return res.status(400).json({
            error: 'password length must be greater than 3'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username,
        passwordHash: passwordHash,
        name: name
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

module.exports = usersRouter