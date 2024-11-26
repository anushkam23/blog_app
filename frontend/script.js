const API_URL = 'http://localhost:3000/blogs';
let currentEditId = null; // Track which post is being edited

// Fetch and display posts
async function fetchPosts() {
    const response = await fetch(API_URL);
    const posts = await response.json();
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>${new Date(post.timestamp).toLocaleString()}</small>
            <button onclick="editPost('${post._id}')">Edit</button>
            <button onclick="deletePost('${post._id}')">Delete</button>
        `;
        postsDiv.appendChild(postDiv);
    });
}

// Create a new post
async function createPost() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
        alert('Please fill in both fields');
        return;
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        fetchPosts();
    }
}

// Delete a post
async function deletePost(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchPosts();
}

// Edit a post
async function editPost(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const post = await response.json();

    document.getElementById('updateTitle').value = post.title;
    document.getElementById('updateContent').value = post.content;
    currentEditId = id;

    document.getElementById('updateForm').style.display = 'block';
}

// Update a post
async function updatePost() {
    const title = document.getElementById('updateTitle').value;
    const content = document.getElementById('updateContent').value;

    if (!title || !content) {
        alert('Please fill in both fields');
        return;
    }

    await fetch(`${API_URL}/${currentEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
    });

    currentEditId = null;
    document.getElementById('updateForm').style.display = 'none';
    fetchPosts();
}

// Cancel update
function cancelUpdate() {
    currentEditId = null;
    document.getElementById('updateForm').style.display = 'none';
}

// Initial fetch
fetchPosts();
