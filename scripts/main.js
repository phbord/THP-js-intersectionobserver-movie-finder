class MovieFinder {
    constructor() {
        this.getUrl = '';
        this.lazy = ''; 
        this.form = document.getElementById('search-movies-form');
        this.inputSearch = document.getElementById('movie-search');
        this.btnElt = document.getElementsByClassName('btn-modal');
        this.searchList = document.getElementById('search-list');
        this.poster = document.getElementById('poster');
        this.movieTitle = document.getElementById('movie-title');
        this.releaseDate = document.getElementById('release-date');
        this.plot = document.getElementById('plot');
    }

    async showMovies() {
        let data = await this.getData();
        await this.listData(data.Search);
    }

    async getData() {
        let result = '';
        const data = await fetch(this.getUrl)
            .then(res => res.json())
            .then(res => result = res)
            .catch(err => console.error('Error =>', err));
        return result;
    }

    async getModalData(imdb) {
        let url = `https://www.omdbapi.com/?i=${imdb}&apikey=973f03ea`;
        let result = '';
        const data = await fetch(url)
            .then(res => res.json())
            .then(res => result = res)
            .catch(err => console.error('Error =>', err));
        return result;
    }

    async listData(data) {
        this.searchList.innerHTML = '';
        data.map(record => {
            this.searchList.innerHTML += this.populateTemplate(record);
        });
    }

    observerElements() {
        this.lazy = document.getElementsByClassName("lazy");
        document.addEventListener('scroll', () => {
            const imageObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.intersectionRatio > 0.5) {
                        let lazyItem = entry.target;
                        lazyItem.classList.remove('opacity-0');
                        imageObserver.unobserve(lazyItem);
                        lazyItem.classList.remove('lazy');
                    }
                })
            });

            for (let i = 0; i < this.lazy.length; i++){
                this.lazy[i].classList.add('opacity-0');
                imageObserver.observe(this.lazy[i]);
            };
        })
    }

    async listenReadMore() {
        this.searchList.addEventListener('click', async (e) => {
            e.preventDefault();
            if (e.target.classList.contains('btn-modal')) {
                const id = e.target.id;
                const movieData = await this.getModalData(id);
                this.populateModal(movieData);
            }
        });
    }

    async listenQuery() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = this.inputSearch.value.split(' ');
            const query = val.join('+');
            this.getUrl = `https://www.omdbapi.com/?s=${query}&apikey=973f03ea`;

            this.showMovies();
            this.listenReadMore();
            this.observerElements();
        });
    }

    populateTemplate(data) {
        let content = `
            <li class="card lazy">
                <img src="${data.Poster}.png" alt="${data.Title}" class="">
                <div class="card-body">
                    <h5 class="card-title">${data.Title}</h5>
                    <p class="card-text">${data.Year}</p>
                    <button type="button" data-bs-toggle="modal" data-bs-target="#infos-modal" class="btn btn-primary btn-modal" id="${data.imdbID}">Read More</button>
                </div>
            </li>
        `;
        return content;
    }

    populateModal(data) {
        this.poster.setAttribute('src', data.Poster);
        this.movieTitle.innerText = data.Title;
        this.releaseDate.innerText = data.Released;
        this.plot.innerText = data.Plot;
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const movieFinder = new MovieFinder();
    movieFinder.listenQuery();
});

