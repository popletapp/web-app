export const BlogPost = {
  title: String,
  content: String, // also supports markdown
  createdAt: Date,
  modifiedAt: Date,
  createdBy: Object, // user object
  type: Number // 1 for change log, 2 for general blog post, 3 for misc
}