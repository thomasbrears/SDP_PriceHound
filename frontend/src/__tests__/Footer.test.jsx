import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer'; 
import { ThemeContext } from '../ThemeContext';

// Mock the LogOutButton component
jest.mock('../components/LogOutButton', () => () => <button>Log Out</button>);

// Mocking useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Footer', () => {
  const renderFooter = (isAuthenticated = false, theme = 'light') => {
    const value = { theme }; //   ThemeContext value
    return render(
      <ThemeContext.Provider value={value}>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </ThemeContext.Provider>
    );
  };

  test('calls handleSignInClick when Sign In button is clicked', () => {
    renderFooter(false); // user is not authenticated
    const signInButton = screen.getByText(/Sign in/i);

    fireEvent.click(signInButton);

    // Debugging logs
    console.log('Previous URL:', sessionStorage.getItem('previousUrl'));
    console.log('Navigate calls:', mockNavigate.mock.calls);

    expect(sessionStorage.getItem('previousUrl')).toBe('/');
    expect(mockNavigate).toHaveBeenCalledWith('/login'); // Check that navigate was called correctly
  });

  test('calls handleSignUpClick when Sign Up button is clicked', () => {
    renderFooter(false); //  user is not authenticated
    const signUpButton = screen.getByText(/Sign up/i);

    fireEvent.click(signUpButton);

    // Debugging logs
    console.log('Previous URL:', sessionStorage.getItem('previousUrl'));
    console.log('Navigate calls:', mockNavigate.mock.calls);

    expect(sessionStorage.getItem('previousUrl')).toBe('/');
    expect(mockNavigate).toHaveBeenCalledWith('/signup'); // Check that navigate was called correctly
  });

  afterEach(() => {
    localStorage.removeItem('user'); // clear local storage
    sessionStorage.clear(); // clear session storage
  });
  test('renders manage account and wishlist links when authenticated', () => {
    localStorage.setItem('user', JSON.stringify({})); // Mock authenticated user
    renderFooter(true); // user is authenticated
  
    expect(screen.getByText(/Manage My Account/i)).toBeInTheDocument();
    expect(screen.getByText(/My Wishlist/i)).toBeInTheDocument();
 
  });
});

