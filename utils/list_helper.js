const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item
    }
    return blogs.map(blogs => blogs.likes).reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    let favourite = blogs[0]
    blogs.forEach(blog => {
        if (blog.likes > favourite.likes) {
            favourite = blog
        }
    });
    return favourite
}

const mostBlogs = (blogs) => {
    let frequencies = []
    blogs.forEach(blog => {
        if (frequencies.map(freq => freq.author).includes(blog.author)) {
            const index = frequencies.findIndex(freq => freq.author === blog.author)
            frequencies[index].blogs += 1
        } else {
            frequencies.push({
                author: blog.author,
                blogs: 1
            })
        }
    })
    const sortedFrequencies = _.orderBy(frequencies, ['blogs'], ['desc'])
    console.log(sortedFrequencies)
    return sortedFrequencies[0]
}

const mostLikes = (blogs) => {
    let totalLikes = []
    blogs.forEach(blog => {
        if (totalLikes.map(like => like.author).includes(blog.author)) {
            const index = totalLikes.findIndex(like => like.author === blog.author)
            totalLikes[index].likes += blog.likes
        } else {
            totalLikes.push({
                author: blog.author,
                likes: blog.likes
            })
        }
    })
    const sortedByLikes = _.orderBy(totalLikes, ['likes'], ['desc'])
    console.log(sortedByLikes)
    return sortedByLikes[0]
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}