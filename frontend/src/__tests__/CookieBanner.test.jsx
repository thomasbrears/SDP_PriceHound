import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CookieBanner from '../components/CookieBanner';
import { getAnalytics, logEvent } from 'firebase/analytics';
import app from '../FirebaseAuth/Firebase';
import { TextDecoder } from 'util';

global.TextDecoder = TextDecoder; // global TextDecoder for Jest

// Mock Firebase Analytics
jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
  logEvent: jest.fn(),
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

describe('CookieBanner Component', () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
    jest.clearAllMocks(); // Clear mock calls
  });

  // Test #1 - renders cookie banner when cookies have not been accepted
  test('renders cookie banner when cookies have not been accepted', () => {
    render(<CookieBanner />);
    
    // Check that the banner is visible initially
    const bannerText = screen.getByText(/We use cookies and other technologies/i);
    expect(bannerText).toBeInTheDocument();
  });

  // Test #2 - hides the banner when "Necessary cookies only" is clicked
  test('hides the banner when "Necessary cookies only" is clicked', () => {
    render(<CookieBanner />);
    
    const necessaryCookiesButton = screen.getByText('Necessary cookies only');
    
    fireEvent.click(necessaryCookiesButton);
    
    // Check that the banner is hidden
    expect(screen.queryByText(/We use cookies and other technologies/i)).not.toBeInTheDocument();

    // Check that localStorage has the correct value
    expect(localStorage.getItem('cookies')).toBe('false');
  });

  // Test #3 - does not show the banner if cookies were previously accepted
  test('does not show the banner if cookies were previously accepted', () => {
    // Simulate the user having previously accepted cookies
    localStorage.setItem('cookies', 'true');
    
    render(<CookieBanner />);
    
    // Check that the banner is not visible
    expect(screen.queryByText(/We use cookies and other technologies/i)).not.toBeInTheDocument();
  });
});
