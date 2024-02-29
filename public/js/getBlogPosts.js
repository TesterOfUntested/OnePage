document.addEventListener('DOMContentLoaded', function() {
    const blogContainer = document.getElementById('blog');
    const apiEndpoint = blogContainer.getAttribute('data-api-endpoint');

    fetchAndDisplayPosts(apiEndpoint);
});

async function fetchAndDisplayPosts(apiEndpoint, pageNumber = 1, postsPerPage = 9) {
    try {
        console.log(apiEndpoint);

        const response = await fetch(apiEndpoint);
        const posts = await response.json();

        // Obliczamy indeks początkowy i końcowy dla aktualnej strony
        const startIndex = (pageNumber - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        
        // Wybieramy tylko posty dla aktualnej strony
        const postsForCurrentPage = posts.slice(startIndex, endIndex);

        let html = ''; // Pusty string na kod HTML

        // Iterujemy przez posty dla aktualnej strony i tworzymy odpowiedni kod HTML
        for (let i = 0; i < postsForCurrentPage.length; i++) {
            // Jeśli to początek nowego rzędu, otwórz nowy div.row
            if (i % 3 === 0) {
                html += '<div class="row">';
            }

            // Dodajemy col-md-4 dla każdego posta
            html += `<div class="col-md-4">
                        <div class="post">
                            <h2>${postsForCurrentPage[i].title}</h2>
                            <p>${postsForCurrentPage[i].content}</p>
                        </div>
                     </div>`;

            // Jeśli to koniec rzędu, zamknij div.row
            if ((i + 1) % 3 === 0 || i === postsForCurrentPage.length - 1) {
                html += '</div>'; // Zamknij div.row
            }
        }

        // Wyświetlamy paginację
        const totalPages = Math.ceil(posts.length / postsPerPage);
        let paginationHtml = '<ul class="pagination">';
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<li class="page-item ${pageNumber === i ? 'active' : ''}">
                                    <a class="page-link" href="#" onclick="fetchAndDisplayPosts(${i})">${i}</a>
                               </li>`;
        }
        paginationHtml += '</ul>';

        // Łączymy kod HTML paginacji z kodem HTML postów
        html += paginationHtml;

        const postsContainer = document.getElementById('postsContainer');

        if (postsContainer) {
            postsContainer.innerHTML = html;
        } else {
            console.error('Element o id "postsContainer" nie został znaleziony.');
        }
    } catch (error) {
        console.error('Błąd podczas pobierania i wyświetlania postów:', error);
    }
}

// Wywołujemy funkcję fetchAndDisplayPosts dla pierwszej strony po załadowaniu strony
fetchAndDisplayPosts();