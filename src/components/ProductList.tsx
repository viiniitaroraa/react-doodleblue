import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, toggleCategoryFilter, setSort, setPage, filterAndSortProducts } from '../store/productsSlice';
import Placeholderimg from '../assets/images/mainbanner-bg.jpg';
import Chevron from '../assets/images/chevron.png';
import { addToCart } from '../store/cartSlice';
import { RootState, AppDispatch } from '../store';
import Heart from '../assets/images/heart.png';
import Filter from '../assets/images/filter-text.png';
import Banner from './Banner';
import Loading from './loading';
import Error from './Error';

const categories = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing"
];

const ProductList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { filteredProducts, status, error, filters, sort, pagination } = useSelector((state: RootState) => state.products);
  const { products } = useSelector((state: RootState) => state.products);
  const [isLoading, setIsLoading] = useState(true)

  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [addedProductClass, setAddedProductClass] = useState<number | null>(null);
  useEffect(() => {
    setIsLoading(true);
    if (status === 'idle') {
      dispatch(fetchProducts());
    } else if (status === 'loading') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [dispatch, status]);

  useEffect(() => {
    dispatch(filterAndSortProducts());
  }, [dispatch, filters, sort, pagination.currentPage, status]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleCategoryFilter(e.target.value));
    dispatch(filterAndSortProducts());
  };
  const handleAddToCart = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      setAddedProductId(productId);
      setAddedProductClass(productId);

      setTimeout(() => {
        setAddedProductId(null);
        setAddedProductClass(null);
      }, 2000);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    dispatch(filterAndSortProducts());
  };
  if (isLoading) {
    return <Loading />;
  }
  if (status === 'failed') {
    return <Error/>;
  }
  return (
    <>
      <Banner />
      <div className="product-list">

        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="sidebar">
                <nav className="breadcrumb-container mb-3" aria-label="breadcrumb" >
                 
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/">Clothing</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/">Women's</Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Outwear
                      </li>
                    </ol>
                 
                </nav>
                <div className="d-block d-sm-block d-md-none filter">
               <span> <img src={Filter}
                            alt="filter" /></span>
                  </div>
                <div className="d-none d-sm-none d-md-block">
                <h4 className="pt-1 pb-2">Filters:</h4>
                <div>
                  <h6>Categories</h6>
                  {categories.map((category) => (
                    <div className="cs-checkbox" key={category}>
                      <input
                        type="checkbox"
                        value={category}
                        id={category}
                        checked={filters.categories.includes(category)}
                        onChange={handleCategoryChange}
                        className="checkbox-input"
                      />
                      <label htmlFor={category} className="checkbox-label"><span>{category.charAt(0).toUpperCase() + category.slice(1)}</span></label>
                    </div>
                  ))}
                </div>
                </div>
              
              </div>
            </div>
            <div className="col-lg-9">
              <div className="d-flex justify-content-center justify-content-sm-center justify-content-md-between align-items-center mb-3">
                <p className='pt-1'><strong>38 Results</strong></p>
                <div className="sorting d-none d-sm-none d-md-flex">
                  <select
                    value={sort}
                    onChange={(e) => dispatch(setSort(e.target.value as 'asc' | 'desc' | 'popularity'))}
                  >
                    <option value="asc">Price (Low to High)</option>
                    <option value="desc">Price (High to Low)</option>
                    <option value="popularity">Popularity</option>
                  </select>

                </div>
              </div>
              {filteredProducts.length === 0 ? (
                <div className='no-data'>
                  <p>No products available in this price range.</p>
                </div>
              ) : (
                <div className="row">
                  {filteredProducts.map(product => (
                    <div className="col-6 col-md-6 col-lg-4">
                      <div className="card" key={product.id} title={product.title}>
                        <Link to={`/product/${product.id}`}>
                          <img src={product.image ? product.image : Placeholderimg}
                            alt={product.title} />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title truncate" >{product.title}</h5>
                          <p className="card-text">${product.price}</p>
                          <div className="heart"><img src={Heart}/></div>
                         
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="pagination pb-3">
            <button
              disabled={pagination.currentPage === 1}
              className="prev"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              <img src={Chevron} alt="Previous" />
            </button>
            {Array.from({ length: Math.ceil(pagination.totalItems / pagination.itemsPerPage) }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  className={`page-number ${pagination.currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              disabled={pagination.currentPage === Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
              className="next"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              <img src={Chevron} alt="Next" />
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

export default ProductList;
