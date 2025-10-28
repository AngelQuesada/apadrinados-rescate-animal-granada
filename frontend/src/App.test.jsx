import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('should render the header with the logo', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Wait for the logo to be present, allowing async operations to complete
    await waitFor(() => {
      const logo = screen.getByAltText(/Rescate Animal Granada/i);
      expect(logo).toBeInTheDocument();
    });
  });
});
