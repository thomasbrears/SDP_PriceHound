import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingSection from '../components/SettingSection'; // Adjust the path if necessary
import '@testing-library/jest-dom';

// Helper function to set up and render the component
const renderSettingSection = () => {
  return render(<SettingSection />);
};

describe('SettingSection', () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
  });

  test('renders the block ads checkbox with the correct initial state', () => {
    // Render the component
    renderSettingSection();

    // Check if the checkbox is rendered
    const checkbox = screen.getByRole('checkbox', { name: /block ads/i });
    expect(checkbox).toBeInTheDocument();

    // Since adsBlocked is initially false, the checkbox should not be checked
    expect(checkbox).not.toBeChecked();
  });

  test('enables adsBlocked when checkbox is clicked', () => {
    // Render the component
    renderSettingSection();

    // Find the checkbox
    const checkbox = screen.getByRole('checkbox', { name: /block ads/i });

    // Click the checkbox to block ads
    fireEvent.click(checkbox);

    // After clicking, it should be checked
    expect(checkbox).toBeChecked();

    // Verify that the adsBlocked state is saved to localStorage
    expect(localStorage.getItem('adsBlocked')).toBe('true');
  });

  test('disables adsBlocked when checkbox is clicked again', () => {
    // Initially set adsBlocked to true in localStorage
    localStorage.setItem('adsBlocked', JSON.stringify(true));

    // Render the component
    renderSettingSection();

    // Find the checkbox (it should be checked initially)
    const checkbox = screen.getByRole('checkbox', { name: /block ads/i });
    expect(checkbox).toBeChecked();

    // Click the checkbox to unblock ads
    fireEvent.click(checkbox);

    // After clicking, it should not be checked
    expect(checkbox).not.toBeChecked();

    // Verify that the adsBlocked state is saved to localStorage as false
    expect(localStorage.getItem('adsBlocked')).toBe('false');
  });
});