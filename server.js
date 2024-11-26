// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;  // Use a PORT from environment variables or default to 3000

// MongoDB URI from environment variables
const MONGO_URI = process.env.MONGODB_URI;  // Read the MongoDB URI from the .env file

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Define Schema and Model
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// CRUD Routes

// Get all posts
app.get('/blogs', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).send({ error: 'Failed to retrieve posts' });
    }
});

// Get a single post by ID
app.get('/blogs/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).send({ error: 'Failed to retrieve post' });
    }
});

// Create a new post
app.post('/blogs', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send({ error: 'Title and content are required' });
    }

    try {
        const newPost = new Post({ title, content });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).send({ error: 'Failed to create post' });
    }
});

// Delete a post
app.delete('/blogs/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.status(204).end();
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete post' });
    }
});

// Update a post
app.put('/blogs/:id', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send({ error: 'Title and content are required' });
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        if (!updatedPost) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update post' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
