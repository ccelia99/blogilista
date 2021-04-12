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
  
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}