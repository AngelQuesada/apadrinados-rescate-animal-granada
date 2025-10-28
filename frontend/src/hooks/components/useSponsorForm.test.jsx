import { renderHook, act } from '@testing-library/react';
import useSponsorForm from './useSponsorForm';
import { useDogsContext } from '#hooks/context/useDogsContext';
import { useUIContext } from '#hooks/context/useUIContext';
import { useSnackbar } from '#hooks/context/useSnackbar';
import useAxios from '#hooks/useAxios';

// Mock de todos los hooks de los que depende useSponsorForm
jest.mock('#hooks/context/useDogsContext');
jest.mock('#hooks/context/useUIContext');
jest.mock('#hooks/context/useSnackbar');
jest.mock('#hooks/useAxios');

describe('useSponsorForm', () => {
  let mockSetAllDogs;
  let mockCloseSponsorForm;
  let mockShowSnackbar;
  let mockPost;

  // Configuración base de los mocks para cada test
  const setupMocks = (allSponsors = []) => {
    mockSetAllDogs = jest.fn();
    mockCloseSponsorForm = jest.fn();
    mockShowSnackbar = jest.fn();
    mockPost = jest.fn().mockResolvedValue({}); // Mock por defecto para evitar errores de undefined

    useDogsContext.mockReturnValue({
      profileDog: { id: 1, sponsors: [] },
      allSponsors,
      allDogs: [],
      setAllDogs: mockSetAllDogs,
    });

    useUIContext.mockReturnValue({
      sponsorForm: { isOpen: true, sponsor: null }, // Modo "Añadir"
      closeSponsorForm: mockCloseSponsorForm,
    });

    useSnackbar.mockReturnValue({
      showSnackbar: mockShowSnackbar,
    });

    useAxios.mockReturnValue({
      error: null,
      loading: false,
      post: mockPost,
    });
  };

  it('should return initial state correctly', () => {
    setupMocks();
    const { result } = renderHook(() => useSponsorForm());

    expect(result.current.formData).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({ name: '', email: '' });
    expect(result.current.isEditMode).toBe(false);
  });

  it('should show validation errors for empty fields on submit', async () => {
    setupMocks();
    const { result } = renderHook(() => useSponsorForm());
    const event = { preventDefault: jest.fn() };

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current.errors.name).toBe('El nombre debe tener al menos 3 caracteres.');
    expect(result.current.errors.email).toBe('Por favor, introduce un email válido.');
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('should show validation error for existing email', async () => {
    // Setup con un sponsor existente
    setupMocks([{ id: 10, email: 'test@test.com' }]);

    const { result } = renderHook(() => useSponsorForm());
    const event = { preventDefault: jest.fn() };

    // Rellenamos el formulario con el email existente
    act(() => {
      result.current.setFormData({ name: 'Test User', email: 'test@test.com' });
    });

    // Enviamos el formulario
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.errors.email).toBe('Este email ya está registrado como sponsor.');
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('should call post and show success on valid submission', async () => {
    setupMocks();
    mockPost.mockResolvedValue({ ok: true, message: 'Success', newSponsor: { id: 2, name: 'Test User', email: 'test@test.com' } });
    const { result } = renderHook(() => useSponsorForm());
    const event = { preventDefault: jest.fn() };

    act(() => {
      result.current.setFormData({ name: 'Test User', email: 'test@test.com' });
    });

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(mockPost).toHaveBeenCalledWith("/wordpress/save-sponsor-and-dog-sponsor", {
      name: 'Test User',
      email: 'test@test.com',
      dog_id: 1,
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith('Success', 'success');
    expect(mockCloseSponsorForm).toHaveBeenCalled();
    expect(mockSetAllDogs).toHaveBeenCalled();
  });
});