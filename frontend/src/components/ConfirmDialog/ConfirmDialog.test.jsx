import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const mockOnAccept = jest.fn();
  const mockOnClose = jest.fn();

  const props = {
    isOpen: true,
    title: 'Test Title',
    content: 'Test content message.',
    onAccept: mockOnAccept,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    mockOnAccept.mockClear();
    mockOnClose.mockClear();
  });

  it('should render the title and content correctly', () => {
    render(<ConfirmDialog {...props} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content message.')).toBeInTheDocument();
  });

  it('should call onAccept and onClose when the accept button is clicked', () => {
    render(<ConfirmDialog {...props} />);

    const acceptButton = screen.getByText('Aceptar');
    fireEvent.click(acceptButton);

    expect(mockOnAccept).toHaveBeenCalledTimes(1);
    // La función handleAccept también llama a handleClose
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the cancel button is clicked', () => {
    render(<ConfirmDialog {...props} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    // No debería llamarse a onAccept
    expect(mockOnAccept).not.toHaveBeenCalled();
  });

  it('should render with custom button texts', () => {
    const customProps = {
      ...props,
      acceptButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'No, volver atrás',
    };
    render(<ConfirmDialog {...customProps} />);

    expect(screen.getByText('Sí, estoy seguro')).toBeInTheDocument();
    expect(screen.getByText('No, volver atrás')).toBeInTheDocument();
  });
});
