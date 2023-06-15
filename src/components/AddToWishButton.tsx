import React from 'react';
import { Deal } from './ListView';
import './AddToWishButton.css'

interface BuyButtonProps {
  item: Deal;
  handleBuy: (item: Deal) => void;
}

const AddToWishButton: React.FC<BuyButtonProps> = ({ item, handleBuy }) => {
  return (
    <div className="button-container">
      <button className="button" onClick={() => handleBuy(item)}>
        Add to Wishlist
      </button>
    </div>
  );
};

export default AddToWishButton;