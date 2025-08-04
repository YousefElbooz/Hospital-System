const { validationResult } = require("express-validator");
let posts =require("../data/postsData")
function getAllPosts(req, res) {
  res.status(200).json(posts);
}
function getPostsRev(req, res) {
  res.status(200).json(posts.reverse());
}
function getPost(req, res) {
  let id = +req.params.id;
  let foundedPost = posts.find((post) => post.postId == id);
  foundedPost
    ? res.status(200).json(foundedPost)
    : res.status(404).send("Post Has Not Been Found");
}
function addPost(req, res) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  let newPost = req.body;
  let newPostID = posts.length === 0 ? 1 : posts.length + 1;
  newPost.postId = newPostID;
  posts.push(newPost);
  res.status(201).json(posts);
}
function editpost(req, res) {
  let id = +req.params.id;
  // console.log(id);
  let updatedPost = req.body;
  let foundedPost = posts.find((post) => post.postId == id);
  if (!foundedPost) {
   return res.status(404).send("Post Not Found");
  }
  foundedPost = { ...foundedPost, ...updatedPost };
  posts = posts.map((post) => {
    return post.postId === foundedPost.postId ? foundedPost : post;
  });
  res.status(201).json(foundedPost);
}
function deltePost(req, res) {
  let id = +req.params.id;
  let foundedPost = posts.find((p) => p.postId === id);
  if (!foundedPost) {
    return res.status(404).send("Post Has Not Been Found");
  }
  posts = posts.filter((post) => post.postId !== id);
  res.status(200).json(posts);
}
module.exports={getAllPosts,getPostsRev,getPost,addPost,editpost,deltePost}
