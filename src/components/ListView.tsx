import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ListView.css';
import AddToWishButton from './AddToWishButton';
import { AuthContext } from './AuthContext';
import Select from 'react-select';
import Navbar from './Navbar';
export interface Deal {
  dealID: string;
  storeID: string;
  gameID: string;
  thumb: string;
  title: string;
  salePrice: string;
  normalPrice: string;
  isOnSale: string;
  savings: string;
  metacriticScore: string;
  steamRatingText: string | null;
  steamRatingPercent: string;
  steamRatingCount: string;
  steamAppID: string | null;
  releaseDate: number;
  lastChange: number;
  dealRating: string;
  internalName: string;
  metacriticLink: string | null;
  rating: number | null
}

export interface Store {
  storeID: string;
  storeName: string;
  isActive: number;
  images: {
    banner: string;
    logo: string;
    icon: string;
  };
}

const ListView: React.FC = () => {
  const [data, setData] = useState<Deal[]>([]);
  const [storeData, setStoreData] = useState<Store[]>([]);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('token');
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<Deal[]>([]);
  const [sortOption, setSortOption] = useState<string>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleFilterChange = (selectedOptions: any) => {
    const updatedOptions = selectedOptions.map((option: any) => option.value);
    setFilterOptions(updatedOptions);
  };

  const handleApplyFilters = () => {
    // Apply the filter
    let filtered =[]
    if (filterOptions.length === 0){
      filtered = data.filter((deal) =>
      (!minPrice || parseFloat(deal.salePrice) >= parseFloat(minPrice)) &&
      (!maxPrice || parseFloat(deal.salePrice) <= parseFloat(maxPrice))
      );
    }
    else{
      filtered = data.filter((deal) =>
      filterOptions.includes(deal.storeID) &&
      (!minPrice || parseFloat(deal.salePrice) >= parseFloat(minPrice)) &&
      (!maxPrice || parseFloat(deal.salePrice) <= parseFloat(maxPrice))
    );
  }
  console.log(sortOption);

  if (sortOption != ''){
   
    if (sortOption == 'price'){
      filtered = filtered.sort((a, b) => {
        // Compare salePrice
        const salePriceComparison = parseFloat(a.salePrice) - parseFloat(b.salePrice);
        
        // If salePrice is equal, compare storeName
        if (salePriceComparison === 0) {
          // Use localeCompare() for string comparison (storeName)
          return a.title.localeCompare(b.title);
        }
        
        return salePriceComparison;
      });
    }
    else{
      filtered = filtered.sort((a, b) => {
        // Compare salePrice
            const titleComparison = a.title.localeCompare(b.title);
            
            // If salePrice is equal, compare storeName
            if (titleComparison === 0) {
              const salePriceComparison = parseFloat(a.salePrice) - parseFloat(b.salePrice);
              return salePriceComparison;
            }
            
            return titleComparison;
      });
    }

  }



    

    setFilteredData(filtered);

  };




  const getStoreName = (storeID: string): string => {
    const store = storeData.find((store) => store.storeID === storeID);
    return store ? store.storeName : '';
  };

  const handleBuy = (item: Deal) => {
    console.log('Buy clicked for item:', item);

    if (isAuthenticated === true) {
      axios
        .post('http://127.0.0.1:8000/api/dashboard', item, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })
        .then((response) => {
          console.log('Item added to wishlist:', response.data);
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('Error adding item to wishlist:', error);
        });
      navigate('/dashboard');
    } else {
      console.log('false');
      navigate('/login');
    }
  };

  useEffect(() => {
    axios
      .get<Deal[]>('https://www.cheapshark.com/api/1.0/deals')
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
        console.log(response);
        axios
          .get<Store[]>('https://www.cheapshark.com/api/1.0/stores')
          .then((storeresponse) => {
            setStoreData(storeresponse.data);
            console.log(storeresponse.data);
          })
          .catch((error) => {
            console.error('Error fetching store data:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching deal data:', error);
      });
  }, []);

  return (
    <div data-testid="list-view">
        <Navbar/>
      


        <div className="filter-container">
          <label>Filter by Store:</label>
          <Select
            options={storeData.map((store) => ({ value: store.storeID, label: store.storeName }))}
            value={filterOptions.map((option) => ({ value: option, label: getStoreName(option) }))}
            isMulti
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="price-filter-container">
          <label>Minimum Price:</label>
          <input
            type="text"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Enter minimum price"
            className="price-input"
          />
          <label>Maximum Price:</label>
          <input
            type="text"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Enter maximum price"
            className="price-input"
          />
          <div className="sort-container">
          <label>Sort by:</label>
            <div>
              <input
                type="radio"
                name="sort"
                id="sort-price"
                value="price"
                checked={sortOption === 'price'}
                onChange={() => setSortOption('price')}
              />
              <label htmlFor="sort-price">Price</label>
            </div>
            <div>
              <input
                type="radio"
                name="sort"
                id="sort-title"
                value="title"
                checked={sortOption === 'title'}
                onChange={() => setSortOption('title')}
              />
              <label htmlFor="sort-title">Title</label>
            </div>
          </div>
          <button onClick={handleApplyFilters} className="apply-button">
            Apply
          </button>
        </div>
    
      
        <div className="container">
        {/* Render your data in the ListView */}
        {filteredData.map((item) => (
          <div className="item" key={item.dealID}>
            <h1>{item.title}</h1>
            <img src={item.thumb} alt={item.title} />
            <p>Price: ${item.salePrice}</p>
            <p>Normal Price: ${item.normalPrice}</p>
            <p>Savings: {parseFloat(item.savings).toFixed(2)}%</p>
            <p className="store">Store: {getStoreName(item.storeID)}</p>
            <AddToWishButton item={item} handleBuy={handleBuy} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;
