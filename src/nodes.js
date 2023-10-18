const selectors = (id) => document.querySelector(id)

//Sections
const headerSection = selectors('#header')
const trendingPreviewSection = selectors('#trendingPreview')
const categoriesPreviewSection = selectors('#categoriesPreview')
const genericListSection = selectors('#genericList')
const movieDetailSection = selectors('#movieDetail')

//List Containers
const searchForm = selectors('#searchForm')
const trendingMoviesPreviewList = selectors('.trendingPreview-movieList')
const categoriesPreviewList = selectors('.categoriesPreview-list')
const movieDetailCategoriesList = selectors('#movieDetail .categories-list')
const relatedMoviesContainer = selectors('.relatedMovies-scrollContainer')

//Elements
const headerTitle = selectors('.header-title')
const headerArrow = selectors('.header-arrow')
const headerCategoryTitle = selectors('.header-title--categoryView')
const searchFormInput = selectors('#searchForm input')
const searchFormBtn = selectors('#searchBtn')
const trendingBtn = selectors('.trendingPreview-btn')
const movieDetailTitle = selectors('.movieDetail-title')
const movieDetailScore = selectors('.movieDetail-score')
const movieDetailDescription = selectors('.movieDetail-description')
