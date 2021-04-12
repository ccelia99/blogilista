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
  
module.exports = {
  dummy,
  totalLikes
}