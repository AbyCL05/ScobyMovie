searchFormBtn.addEventListener('click', () => location.hash = '#search=' + searchFormInput.value)
trendingBtn.addEventListener('click', () => location.hash = '#trends=')
headerArrow.addEventListener('click', () => history.back())

window.addEventListener('DOMContentLoaded', navigator, false )
window.addEventListener('hashchange', navigator, false )

function navigator () {
    if(location.hash.startsWith('#trends')) {
        trendsPage()
    } else if (location.hash.startsWith('#search=')) {
        searchPage()
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage()
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage()
    } else {
        homePage()
    }
    
    window.scrollTo(0, 0) //O tmb:
    //document.body.scrollTop = 0;
    //document.documentElement.scrollTop
}
function homePage () {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ' ';
    headerArrow.classList.add('inactive');
    headerArrow.classList.remove('header-arrow--white')
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')
    trendingPreviewSection.classList.remove('inactive')
    categoriesPreviewSection.classList.remove('inactive')
    genericListSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')

    getTrendingMoviesPreview()
    getCategoriesMoviesPreview()
} 
function categoriesPage () {

    headerSection.classList.remove('header-container--long')
    headerSection.style.background = '';
    headerArrow.classList.remove('inactive');
    headerArrow.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    //Utilizamos desestructuración para filtrar por categorias
    const [_, categoryData] = location.hash.split('=') //Separamos el string del hash por medio del =. 
    const [categoryId, categoryName] = categoryData.split('-') //Volvemos a dividir categoryData para obtener el ID. 

    headerCategoryTitle.innerHTML = decodeURI(categoryName); //Modificamos el título de acuerdo a la categoria (category.name) 
    getMoviesByCategory(categoryId)
}
function movieDetailsPage () {
    headerSection.classList.add('header-container--long')
    //headerSection.style.background = ' ';
    headerArrow.classList.remove('inactive');
    headerArrow.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    const [_, id] = location.hash.split('=')
    getMovieById(id)
}
function searchPage () {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ' ';
    headerArrow.classList.remove('inactive');
    headerArrow.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [_, query] = location.hash.split('=')
    console.log(query);
    renderSearch(query)
}
function trendsPage () {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = '';
    headerArrow.classList.remove('inactive');
    headerArrow.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    headerCategoryTitle.innerHTML = 'Tendencias'
    getTrendingMovies()
}