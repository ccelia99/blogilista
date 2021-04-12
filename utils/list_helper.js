var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likeArray = blogs.map(like =>
    like.likes)
  const reducer = (sum, item) => {
    return sum + item
  }
  return likeArray.length === 0
    ? 0 
    : likeArray.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const likeArray = blogs.map(like =>
    like.likes)
  const maxLikes = Math.max(...likeArray)
  const maxBlog = blogs.find(({likes}) =>
    likes === maxLikes)
  console.log(maxBlog)

  return maxBlog
}

const mostBlogs  = (blogs) => {
  const groupedArray = _(blogs)
    .groupBy('author')
    .map((items, author) => ({ author, count: items.length }))
    .value()
  console.log(groupedArray) 

  const maxAuthor = _.maxBy(groupedArray, function(o) {return o.count} )
  console.log('maxAuthor', maxAuthor)
  
  return maxAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}