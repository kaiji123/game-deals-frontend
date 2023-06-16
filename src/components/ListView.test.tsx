import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AuthContext } from './AuthContext';
import ListView, {Deal, Store} from './ListView';
import '@testing-library/jest-dom/extend-expect';

import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
jest.mock('axios', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          internalName: 'GUACAMELEE2',
          title: 'Guacamelee! 2',
          metacriticLink: '/game/pc/guacamelee!-2',
          dealID: 'cQQP5fu8f9pNszippQug5zClp8ohvxsYRfhPYfoga6g%3D',
          storeID: '25',
          gameID: '191227',
          salePrice: '0.00',
          normalPrice: '19.99',
          isOnSale: '1',
          savings: '100.000000',
          metacriticScore: '84',
          steamRatingText: 'Very Positive',
          steamRatingPercent: '91',
          steamRatingCount: '2183',
          steamAppID: '534550',
          releaseDate: 1534809600,
          lastChange: 1686844884,
          dealRating: '10.0',
          thumb: 'https://cdn.cloudflare.steamstatic.com/steam/apps/534550/capsule_sm_120.jpg?t=1685565276',
        }
      ],
    })
  ),
}));

describe('ListView', () => {
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
  }));
  beforeEach(() => {

    act(() => {
      render(
        <MemoryRouter>
            <AuthContext.Provider value={{ isAuthenticated: true, login: () => {}, logout: () => {} }}>
              <ListView />
            </AuthContext.Provider>
        </MemoryRouter>
      );
    })
  });

  it('renders the ListView component', () => {
    // Verify that the component is rendered
    const listViewElement = screen.getByTestId('list-view');
    expect(listViewElement).toBeInTheDocument();
  });

  it('displays the fetched data', async () => {
    // Wait for the data to be fetched and displayed
    const itemTitleElement = await screen.findByText('Guacamelee! 2');
    const itemPriceElement = screen.getByText('Price: $0.00');
    const itemNormalPriceElement = screen.getByText('Normal Price: $19.99');

    // Verify that the data is displayed correctly
    expect(itemTitleElement).toBeInTheDocument();
    expect(itemPriceElement).toBeInTheDocument();
    expect(itemNormalPriceElement).toBeInTheDocument();
  });

});
