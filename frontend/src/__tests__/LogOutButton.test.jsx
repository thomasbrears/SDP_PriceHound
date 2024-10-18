import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LogOutButton from '../components/LogOutButton';

// Mocking useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LogOutButton', () => {
  beforeEach(() => {
    // Set up localStorage
    localStorage.setItem('token', 'mockToken');
    localStorage.setItem('user', 'mockUser');
    localStorage.setItem('icon', 'mockIcon');
    localStorage.setItem('adsBlocked', 'true');
  });

  afterEach(() => {
    localStorage.clear(); // Clear local storage after each test
    jest.clearAllMocks(); // Clear mock function calls
  });

  test('calls handleLogout and navigates to the correct route when clicked', () => {
    render(
      <MemoryRouter>
        <LogOutButton />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText(/logout/i); // Adjust if you have different text
    fireEvent.click(logoutButton);

    // Check localStorage has been cleared
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('icon')).toBeNull();
    expect(localStorage.getItem('adsBlocked')).toBeNull();

    // Check that navigate was called with the correct argument
    expect(mockNavigate).toHaveBeenCalledWith('/?logout=true');
  });
});