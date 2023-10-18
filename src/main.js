const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        'language': 'es-ES',
    }

})

async function renderMovies(movies, container) {
    container.innerHTML = ' ';
    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')
        movieContainer.addEventListener('click', () => location.hash = '#movie=' + movie.id)

        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.setAttribute('alt', movie.title)
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path)

        movieContainer.appendChild(movieImg)
        container.appendChild(movieContainer)
    });
}

async function renderCategories (categories, container) {
    categoriesPreviewList.innerHTML = '';
    
    categories.forEach(category => {
        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3')
        categoryTitle.classList.add('category-title')
        categoryTitle.setAttribute('id', 'id' + category.id) 
        categoryTitle.addEventListener('click' , () => {
            location.hash = `#category=${category.id}-${category.name}`
        }) 
        const categoryTitleText = document.createTextNode(category.name)

        categoryTitle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTitle)
        container.appendChild(categoryContainer)
    });
}

//Lamdos a la Api

async function getTrendingMoviesPreview () {
    const {data} = await api('trending/movie/day'); 
    const movies = data.results;
    renderMovies(movies, trendingMoviesPreviewList)

//    trendingMoviesPreviewList.innerHTML = ""; //Limpiamos el html para evitar la carga duplicada
//     movies.forEach(movie => {
        
//         const movieContainer = document.createElement('div')
//         movieContainer.classList.add('movie-container')

//         const movieImg = document.createElement('img')
//         movieImg.classList.add('movie-img')
//         movieImg.setAttribute('alt', movie.title)
//         movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path)

//         movieContainer.appendChild(movieImg)
//         trendingMoviesPreviewList.appendChild(movieContainer)
//     });
}

async function getCategoriesMoviesPreview () {
    const {data} = await api('genre/movie/list'); 
    const categories = data.genres;
    renderCategories (categories, categoriesPreviewList)
}

async function getMoviesByCategory (id) {
    const {data} = await api('discover/movie', {
        params: {
            with_genres: id,
        },
    });
    const movies = data.results;
    renderMovies(movies,  genericListSection) 
}

async function renderSearch (query) {
    query = decodeURI(query)
    const {data} = await api('search/movie', {
        params: {
            query
        }
    });
    const movies = data.results;
    console.log(movies)
    renderMovies(movies, genericListSection)
}

async function getTrendingMovies () {
    const {data} = await api('trending/movie/day'); 
    const movies = data.results;
    renderMovies(movies, genericListSection)

//    trendingMoviesPreviewList.innerHTML = ""; //Limpiamos el html para evitar la carga duplicada
//     movies.forEach(movie => {
        
//         const movieContainer = document.createElement('div')
//         movieContainer.classList.add('movie-container')

//         const movieImg = document.createElement('img')
//         movieImg.classList.add('movie-img')
//         movieImg.setAttribute('alt', movie.title)
//         movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path)

//         movieContainer.appendChild(movieImg)
//         trendingMoviesPreviewList.appendChild(movieContainer)
//     });
}

async function getMovieById(id) {
    const { data: movie } = await api('movie/' + id)
    movieDetailTitle.textContent = movie.title;
    movieDetailScore.textContent = movie.vote_average.toFixed(1);
    movieDetailDescription.textContent = movie.overview;

    const imgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path
    headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${imgUrl})
    `;
    renderCategories(movie.genres, movieDetailCategoriesList)
    getRelatedMoviesId(id)
}

async function getRelatedMoviesId (id) {
    const { data} = await api(`movie/${id}/similar`)
    const relatedMovies = data.results;

    renderMovies(relatedMovies, relatedMoviesContainer)
    relatedMoviesContainer.scrollTo(0, 0)
}