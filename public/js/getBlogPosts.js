document.addEventListener('DOMContentLoaded', async function() {
    fetchPosts();
});

async function fetchPosts() {
    try {
        let url;
        if (window.location.pathname === '/tech_blog.html') {
            url = '/tech_posts';
        } else if (window.location.pathname === '/blog.html') {
            url = '/posts';
        } else {
            console.error('Nieobsługiwana strona:', window.location.pathname);
            return;
        }

        const response = await fetch(url);
        const posts = await response.json();

        displayPosts(posts);
    } catch (error) {
        console.error('Błąd podczas pobierania i wyświetlania postów:', error);
    }
}

function displayPosts(posts) {
    let html = '';

    posts.forEach(post => {
        html += `<div class="col-md-4" data-post-id="${post.id}">
                    <a href="/post/${post.id}">
                        <div class="post" data-post-id="${post.id}">
                            <h3 data-post-id="${post.id}">${post.title}</h2>
                            <h6 data-post-id="${post.id}">${post.author}</h4>
                            <p data-post-id="${post.id}">${post.short_description}</p>
                        </div>
                        </a>
                    </div>
                 `;
    });    

    const postsContainer = document.getElementById('postsContainer');
    if (postsContainer) {
        postsContainer.innerHTML = html;
    } else {
        console.error('Element o id "postsContainer" nie został znaleziony.');
    }
}

document.addEventListener('click', async function(event) {
    if ((event.target.tagName == 'DIV' || event.target.tagName == 'P' || event.target.tagName == 'H3' || event.target.tagName == 'H6')  && event.target.getAttribute('data-post-id')) {
        event.preventDefault();

        try {    
            const postId = event.target.getAttribute('data-post-id');
            
            let url;
            if (window.location.pathname === '/tech_blog.html') {
                url = `/tech_post/${postId}`;
            } else if (window.location.pathname === '/blog.html') {
                url = `/post/${postId}`;
            } else {
                console.error('Nieobsługiwana strona:', window.location.pathname);
                return;
            }

            const response = await fetch(url); 
            const postData = await response.json();
            const firstPost = postData[0];
            const postsContainer = document.getElementById('postsContainer');
            postsContainer.innerHTML = `
                <div class="col-md-12" data-id="${firstPost.id}">
                    <div class="post" data-id="${firstPost.id}">
                        <h2 data-id="${firstPost.id}">${firstPost.title}</h2>
                        <h4 data-id="${firstPost.id}">${firstPost.author}</h4>
                        <div class="post-detailed">
                            <p data-id="${firstPost.id}">${firstPost.content}</p>
                        </div>
                    </div>
                </div>
                <button id="backButton">Powrót</button>
            `;
        } catch (error) {
            console.error('Błąd podczas pobierania danych posta:', error);
        }
    }
});

document.addEventListener('click', async function(event) {
    if(event.target.getAttribute('id') == 'backButton') {
        fetchPosts();
    }
});