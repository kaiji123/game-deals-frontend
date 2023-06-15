import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Deal } from './ListView';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Deal[]>([]);
  const [editingDealID, setEditingDealID] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const authToken = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      axios
        .get('http://127.0.0.1:8000/api/dashboard', {
          headers: {
            Authorization: `Bearer ${authToken}` // Include the auth token in the request headers
          }
        })
        .then((response) => {
          const deals = response.data.deals;
          setData(deals);
          console.log(response);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [isAuthenticated, navigate, authToken]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = (dealID: string) => {
    console.log('deleting' + dealID);

    const encodedDealId = encodeURIComponent(dealID);
    axios
      .delete(`http://127.0.0.1:8000/api/dashboard/${encodedDealId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      .then((response) => {
        // Filter out the deleted deal from the data state
        const updatedDeals = data.filter((deal) => deal.dealID !== dealID);
        setData(updatedDeals);
        console.log('Deal deleted successfully:', response);
      })
      .catch((error) => {
        console.error('Error deleting deal:', error);
      });
  };

  const handleEdit = (dealID: string) => {
    setEditingDealID(dealID);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const rating = parseInt(value);
    setRating(rating);
  };
  
  const handleSave = (dealID: string) => {
    // Perform the necessary update logic with the new rating value
    console.log(`Saving rating ${rating} for deal ${dealID}`);
    // You can make an API call here to save the rating to the server if needed
    if (rating === null || Number.isNaN(rating)) {
      setErrorMessage('Please select a valid rating');
      return;
    }
  
    const updatedData = data.map((deal) => {
      if (deal.dealID === dealID) {
        // Update the rating of the deal with the new value
        return { ...deal, rating };
      }
      return deal;
    });
  
    const encodedDealId = encodeURIComponent(dealID);
    const payload = { rating }; // Rating value to be updated
  
    axios
      .put(`http://127.0.0.1:8000/api/dashboard/${encodedDealId}`, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        // Handle the response if needed
        console.log('Rating updated successfully:', response);
  
        // Clear the editing state and error message
        setEditingDealID(null);
        setRating(null);
        setErrorMessage('');
  
        // Update the data state with the modified array
        setData(updatedData);
      })
      .catch((error) => {
        console.error('Error updating rating:', error);
      });
  };
  
  
  return (
    <div>
      {/* Navigation bar */}
      <Navbar/>

      <div className="container">
        {/* Render your data in the ListView */}
        {data.map((deal) => (
          <div key={deal.dealID} className="deal-item">
            <img src={deal.thumb} alt={deal.title} />
            <h2>{deal.title}</h2>
            <p>Sale Price: {deal.salePrice}</p>
            {/* Add other deal information as needed */}
            <p>Normal Price: {deal.normalPrice}</p>
            <p>Savings: {deal.savings}</p>
            <p>Deal Rating: {deal.rating}</p>
            {editingDealID === deal.dealID ? (
              <div className="rating-container">
                <select
                  value={rating || ''}
                  onChange={handleRatingChange}
                  className="rating-select"
                >
                  <option value="">Select rating</option>
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleSave(deal.dealID)}
                  className="button-save"
                >
                  Save
                </button>
                
              </div>
            ) : (
              <div>
                <button onClick={() => handleDelete(deal.dealID)} className="button-delete">
                  Delete
                </button>
                <button onClick={() => handleEdit(deal.dealID)} className="button-edit">
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
        
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Dashboard;
