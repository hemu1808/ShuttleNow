import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ShuttleNow title', () => {
  render(<App />);
  const linkElement = screen.getByText(/ShuttleNow/i);
  expect(linkElement).toBeInTheDocument();
});