// ===============================
// API
// ===============================

// /api/admin/posts
export type PostsResponse = {
  status: string;
  posts: Posts[];
}

// /api/admin/posts/[id] (↑の[]内)
export type Posts = {
  id: number;
  title: string;
  content: string;
  thumbnailImageKey: string;
  createdAt: string;
  updatedAt: string;
  postCategories: PostCategory[]; 
};

// /api/admin/posts/2 (↑の[]内)
export type PostCategory = {
  id: number;
  postId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: {id: number, name: string};
}

// /api/admin/categories
export type Category = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// ===============================
// Contact
// ===============================
export type FormData = {
  name: string;
  email: string;
  message: string;
};

export type Errors = Partial<FormData>;