import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header'
import { ThemeContext } from '../ThemeContext';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage'
import { Routes, Route } from 'react-router-dom';

jest.mock('axios', () => ({
    get: jest.fn(),
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

const theme = 'light';

describe('NavBar', () => {
    test('Renders relevant text', () => {
        render(
            <MemoryRouter>
                <ThemeContext.Provider value={{ theme }}>
                    <Header />
                </ThemeContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByText(/About/i)).toBeInTheDocument();
        expect(screen.getByText(/Contact/i)).toBeInTheDocument();
        expect(screen.getByText(/Brands/i)).toBeInTheDocument();
        //for when the user is not logged in
        expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
    });
    test('Navigates to About page when link is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ThemeContext.Provider value={{ theme }}>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                    </Routes>
                </ThemeContext.Provider>
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText(/About/i));

        expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    });
    test('Navigates to Contact page when link is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ThemeContext.Provider value={{ theme }}>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/Contact" element={<ContactPage />} />
                    </Routes>
                </ThemeContext.Provider>
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText(/Contact/i));

        expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();

    });

    test('renders the pricehound image', () => {
        render(
            <MemoryRouter>
                <ThemeContext.Provider value={{ theme }}>
                    <Header />
                </ThemeContext.Provider>
            </MemoryRouter>
        );

        const profileImage = screen.getByAltText('PriceHound Logo');
        expect(profileImage).toBeInTheDocument();

    });

});

