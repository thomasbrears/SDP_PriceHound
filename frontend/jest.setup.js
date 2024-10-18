import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
  }),
}));
