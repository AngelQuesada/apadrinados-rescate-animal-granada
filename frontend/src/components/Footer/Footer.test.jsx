import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('should render the copyright notice with the current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const expectedText = `© ${currentYear} Rescate Animal Granada. Todos los derechos reservados.`;

    const footerElement = screen.getByText((content, element) => {
      // Normalize the text content of the element
      const normalizedText = element.textContent.replace(/\s+/g, ' ').trim();
      
      // Check if the normalized text matches the expected text
      const hasText = normalizedText === expectedText;
      
      // Ensure that none of the element's children contain the same full text.
      // This helps select the most specific element (the <p> tag) instead of its parents (div, footer, etc.).
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => child.textContent.replace(/\s+/g, ' ').trim() !== expectedText
      );

      return hasText && childrenDontHaveText;
    });

    expect(footerElement).toBeInTheDocument();
  });
});
