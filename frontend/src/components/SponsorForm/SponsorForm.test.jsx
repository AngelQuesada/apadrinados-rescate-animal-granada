
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SponsorForm from './SponsorForm';
import useSponsorForm from '#hooks/components/useSponsorForm';

// Mock the custom hook
jest.mock('#hooks/components/useSponsorForm');

// Default mock return values
const mockUseSponsorForm = {
  formData: { name: '', email: '' },
  errors: { name: '', email: '' },
  isEditMode: false,
  emailInputValue: '',
  sponsorForm: { isOpen: true },
  loading: false,
  setFormData: jest.fn(),
  handleSubmit: jest.fn((e) => e.preventDefault()), // Mock preventDefault
  handleClose: jest.fn(),
  filterExistingSponsors: jest.fn(() => []),
  setEmailInputValue: jest.fn(),
};

describe('SponsorForm Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Setup the default mock implementation
    useSponsorForm.mockReturnValue(mockUseSponsorForm);
  });

  it('should render the form in "Add New Sponsor" mode', () => {
    render(<SponsorForm />);
    expect(screen.getByText('Añadir Nuevo Sponsor')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
  });

  it('should render the form in "Edit Sponsor" mode with pre-filled data', () => {
    useSponsorForm.mockReturnValue({
      ...mockUseSponsorForm,
      isEditMode: true,
      formData: { name: 'Test User', email: 'test@example.com' },
      emailInputValue: 'test@example.com',
    });

    render(<SponsorForm />);
    expect(screen.getByText('Editar Sponsor')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('test@example.com');
  });

  it('should display validation errors', () => {
    useSponsorForm.mockReturnValue({
      ...mockUseSponsorForm,
      errors: { name: 'Name error', email: 'Email error' },
    });

    render(<SponsorForm />);
    expect(screen.getByText('Name error')).toBeInTheDocument();
    expect(screen.getByText('Email error')).toBeInTheDocument();
  });

  it('should disable fields and buttons when loading', () => {
    useSponsorForm.mockReturnValue({ ...mockUseSponsorForm, loading: true });

    render(<SponsorForm />);
    expect(screen.getByLabelText(/Nombre/i)).toBeDisabled();
    expect(screen.getByLabelText(/Email/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeDisabled();
    // The submit button is a custom loading button, we check its disabled state
    expect(screen.getByRole('button', { name: /Añadir Sponsor/i })).toBeDisabled();
  });

  it('should call setFormData when user types in the name field', async () => {
    const user = userEvent.setup();
    render(<SponsorForm />);
    const nameInput = screen.getByLabelText(/Nombre/i);
    await act(async () => {
      await user.type(nameInput, 'John Doe');
    });

    // Check if the mock function was called with the updated state
    // Note: This tests the onChange handler logic
    expect(mockUseSponsorForm.setFormData).toHaveBeenCalled();
  });

  it('should call handleSubmit when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<SponsorForm />);
    const submitButton = screen.getByRole('button', { name: /Añadir Sponsor/i });
    await act(async () => {
      await user.click(submitButton);
    });

    expect(mockUseSponsorForm.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should call handleClose when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<SponsorForm />);
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    await act(async () => {
      await user.click(cancelButton);
    });

    expect(mockUseSponsorForm.handleClose).toHaveBeenCalledTimes(1);
  });
});
