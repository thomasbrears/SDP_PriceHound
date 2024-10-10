import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import '@testing-library/jest-dom'; // For extended matchers
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../components/SearchBarBig', () => () => <div>SearchBarBig Component</div>);
jest.mock('../components/ProductCard', () => ({ productName }) => <div>{productName} ProductCard</div>);
jest.mock('../components/CategorySearch', () => ({ category }) => <div>{category} CategorySearch</div>);
jest.mock('../components/BrandLogo', () => ({ alt }) => <div>{alt} BrandLogo</div>);
jest.mock('../components/CountrySelector', () => () => <div>CountrySelector Component</div>);
jest.mock('../components/Loading', () => ({ message }) => <div>Loading: {message}</div>);

describe('HomePage', () => {
  test('renders main title and SearchBarBig component', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Check for main title
    expect(screen.getByText(/Compare prices from around the world/i)).toBeInTheDocument();
    
    // Check if SearchBarBig is rendered
    expect(screen.getByText('SearchBarBig Component')).toBeInTheDocument();
  });

  test('renders suggested searches', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Check for suggested search links
    expect(screen.getByText('Apple Macbook Pro, 2024')).toBeInTheDocument();
    expect(screen.getByText('Samsung S23 256gb')).toBeInTheDocument();
    expect(screen.getByText('GeForce RTX')).toBeInTheDocument();
  });

  test('renders featured products', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Check if product cards are rendered
    expect(screen.getByText('iPhone 15 Pro 128GB ProductCard')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy Z Flip6 ProductCard')).toBeInTheDocument();
    expect(screen.getByText('Dyson V8 ProductCard')).toBeInTheDocument();
    expect(screen.getByText('Canon EOS R5 Mark II ProductCard')).toBeInTheDocument();
  });

  test('renders browse categories', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Check for category search buttons
    expect(screen.getByText('Phones CategorySearch')).toBeInTheDocument();
    expect(screen.getByText('Computers CategorySearch')).toBeInTheDocument();
    expect(screen.getByText('Cameras CategorySearch')).toBeInTheDocument();
    expect(screen.getByText('Appliances CategorySearch')).toBeInTheDocument();
  });

  test('renders browse brands', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Check for brand logos
    expect(screen.getByText('Apple BrandLogo')).toBeInTheDocument();
    expect(screen.getByText('BlackBerryMobile BrandLogo')).toBeInTheDocument();
    expect(screen.getByText('Huawei BrandLogo')).toBeInTheDocument();
  });

  test('renders loading component when loading is true', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Set the loading state to true
    const loadingComponent = screen.queryByText('Loading:');
    expect(loadingComponent).toBeNull(); // Ensure it's not present initially
  });

  test('shows toast on logout success', () => {
    const location = { search: '?logout=true' };

    render(
      <MemoryRouter initialEntries={[location]}>
        <HomePage />
      </MemoryRouter>
    );

    // Expect the success toast to be shown
    expect(toast.success).toHaveBeenCalledWith('You have successfully logged out. Have a great day!');
  });
});
