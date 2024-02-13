//Data

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

function likedMovieList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'))   //Pasando a objeto lo que tenga localStorage en liked_movies
    let movies
    if (item) {
        movies = item
    } else {
        movies = {}
    }
    return movies
}

function likeMovie(movie) {
    const likedMovies = likedMovieList()
    console.log(likedMovies);

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined
    } else {
        likedMovies[movie.id] = movie
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies))
}

//Utils

const lazyLoader = new IntersectionObserver((entries, observer) => {        //Como vamos a 'observar todo el viewport' , omitimos el objeto options
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img')
           entry.target.setAttribute('src', url)
            observer.unobserve(entry.target)
        }
    })
}) 

async function renderMovies(movies, container, { lazyLoad = false, clean = true }= {}) {
    if (clean) {
        container.innerHTML = ' ';
    }
    
    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')

        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.setAttribute('alt', movie.title)

        movieImg.setAttribute( lazyLoad ? 'data-img' : 'src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path)
        movieImg.addEventListener('click', () => location.hash = '#movie=' + movie.id)
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://img.posterstore.com/zoom/30x40-2-1965.jpg')
        })

        const movieBtn = document.createElement('button')
        movieBtn.classList.add('movie-btn')
        likedMovieList()[movie.id] && movieBtn.classList.add('movie-btn--liked')

        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie)
            getLikedMovies()
        })

        if (lazyLoad) {
            lazyLoader.observe(movieImg)   
        }

        movieContainer.appendChild(movieImg)
        movieContainer.appendChild(movieBtn)                                                                                            
        container.appendChild(movieContainer)
        
    });
}

async function renderCategories (categories, container) {
    categoriesPreviewList.innerHTML = ' ';
    
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

//Llamados a la Api

async function getTrendingMoviesPreview () {
    const {data} = await api('trending/movie/day'); 
    const movies = data.results;
    renderMovies(movies, trendingMoviesPreviewList, {lazyLoad : true, clean: true})
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
    maxPage = data.total_pages
    renderMovies(movies,  genericListSection, { lazyLoad: true }) 
}

function getPaginatedMoviesCategory(id) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement   //Desestructuración 
        const scrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotIMax = page < maxPage

        if (scrollBottom && pageIsNotIMax) {
            page++
            const {data} = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;
            renderMovies(movies, genericListSection, {lazyLoad : true, clean: false})
        }
    }
}

async function renderSearch (query) {
    query = decodeURI(query)
    const {data} = await api('search/movie', {
        params: {
            query
        }
    });
    const movies = data.results;
    maxPage = data.total_pages
    renderMovies(movies, genericListSection)
}

function getPaginatedMoviesSearch(query) {
    return async function () {
         const { scrollTop, scrollHeight, clientHeight } = document.documentElement   //Desestructuración 
        const scrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotIMax = page < maxPage

        if (scrollBottom && pageIsNotIMax) {
            page++
            const {data} = await api('search/movie', {
                params: {
                    query,
                    page
                }
            }); 
            const movies = data.results;
            console.log(data);
            renderMovies(movies, genericListSection, {lazyLoad : true, clean: false})
        }
    }
}

async function getTrendingMovies () {
    const {data} = await api('trending/movie/day'); 
    const movies = data.results;
    maxPage = data.total_pages

    renderMovies(movies, genericListSection, {lazyLoad : true, clean: true})
}

// async function getPaginatedTrendingMovies() {
//     const { scrollTop, scrollHeight, clientHeight } = document.documentElement   //Desestructuración 
//     const scrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)

//     if (scrollBottom) {
//         page++
//         const {data} = await api('trending/movie/day', {
//             params: {
//                 page
//             }
//         }); 
//         const movies = data.results;
//         renderMovies(movies, genericListSection, {lazyLoad : true, clean: false})
//     }
// }

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
    movieDetailCategoriesList.innerHTML = ' '
    renderCategories(movie.genres, movieDetailCategoriesList)
    getRelatedMoviesId(id)
}

async function getRelatedMoviesId (id) {
    const { data} = await api(`movie/${id}/similar`)
    const relatedMovies = data.results;

    renderMovies(relatedMovies, relatedMoviesContainer, true)
    relatedMoviesContainer.scrollTo(0, 0)
}

async function getPaginatedMovies(url) {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement   //Desestructuración 
    const scrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotIMax = page < maxPage

    if (scrollBottom && pageIsNotIMax) {
        page++
        const {data} = await api(url, {
            params: {
                page
            }
        }); 
        const movies = data.results;
        console.log(data);
        renderMovies(movies, genericListSection, {lazyLoad : true, clean: false})
    }
}

function getLikedMovies() {
    const likedMovies = likedMovieList()
    const moviesArray = Object.values(likedMovies)

    renderMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true})
}