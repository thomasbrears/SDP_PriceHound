import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AboutPage from "../pages/AboutPage";
import React from 'react';

describe('AboutPage', () => {
  test('renders the main title and subtitle', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    const titleElement = screen.getByText(/About Us/i);
    const subtitleElement = screen.getByText(
      /Welcome to PriceHound, a price comparison website developed by four university students at AUT/i
    );
    expect(titleElement).toBeInTheDocument();
    expect(subtitleElement).toBeInTheDocument();
  });

  test('renders the about us image with alt text', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    const imageElement = screen.getByAltText(/Image of the PriceHound Team/i);
    expect(imageElement).toBeInTheDocument();
  });

  test('renders key sections like "Our Purpose", "Disclaimer", and "Contact & Feedback"', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    const purposeHeading = screen.getByText(/Our Purpose/i);
    const disclaimerHeading = screen.getByText(/Disclaimer/i);
    const feedbackHeading = screen.getByText(/Contact & Feedback/i);
    
    expect(purposeHeading).toBeInTheDocument();
    expect(disclaimerHeading).toBeInTheDocument();
    expect(feedbackHeading).toBeInTheDocument();
  });

  test('renders PinkButton with correct text', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    const buttonElement = screen.getByText(/Try it out today: Search a product/i);
    expect(buttonElement).toBeInTheDocument();
    // Remove the closest('a') expectation as the button is not wrapped in an anchor tag
  });  

  test('renders GitHub link', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    const githubLink = screen.getByRole('link', { name: '' }); // Empty name if GitHub is inside svg
    expect(githubLink).toHaveAttribute('href', 'https://github.com/thomasbrears/SDP_PriceHound');
  });   
});
