document.addEventListener('DOMContentLoaded', async function() {
    fetchPosts();
});

async function fetchPosts() {
    try {
        const response = await fetch('/posts');
        const posts = await response.json();

        displayPosts(posts);
    } catch (error) {
        console.error('Błąd podczas pobierania i wyświetlania postów:', error);
    }
}

function displayPosts(posts) {
    let html = '';

    posts.forEach(post => {
        html += `<div class="col-md-4">
                    <div class="post">
                        <h2>${post.title}</h2>
                        <p>${post.content}</p>
                    </div>
                 </div>`;
    });

    const postsContainer = document.getElementById('postsContainer');
    if (postsContainer) {
        postsContainer.innerHTML = html;
    } else {
        console.error('Element o id "postsContainer" nie został znaleziony.');
    }
}
