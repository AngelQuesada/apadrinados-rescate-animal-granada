import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DogsGrid from './DogsGrid';
import { useDogsContext } from '#hooks/context/useDogsContext';

// Mock del contexto para proveer datos controlados
jest.mock('#hooks/context/useDogsContext', () => ({
  useDogsContext: jest.fn(),
}));

// Mock del componente DogCard para aislar el test a DogsGrid
jest.mock('#components/DogCard/DogCard', () => {
  // eslint-disable-next-line react/prop-types
  return function DummyDogCard({ name }) {
    return <div data-testid="dog-card">{name}</div>;
  };
});

describe('DogsGrid', () => {
  const mockDogs = [
    // 1. Apadrinado
    { id: 1, name: 'Rex', status: 'publish', sponsors: [{ id: 1, name: 'Sponsor A' }] },
    // 2. Sin apadrinar (publicado)
    { id: 2, name: 'Bella', status: 'publish', sponsors: [] },
    // 3. No disponible (no publicado)
    { id: 3, name: 'Charlie', status: 'draft', sponsors: [] },
  ];

  beforeEach(() => {
    useDogsContext.mockReturnValue({ allDogs: mockDogs });
  });

  it('should render sponsored dogs by default', () => {
    render(<DogsGrid />);
    expect(screen.getByText('Apadrinados')).toBeInTheDocument();
    expect(screen.getByText('Rex')).toBeInTheDocument();
  });

  it('should not render unsponsored or unavailable dogs by default', () => {
    render(<DogsGrid />);
    expect(screen.getByText('Sin apadrinar')).toBeInTheDocument();
    expect(screen.getByText('No disponibles')).toBeInTheDocument();

    // Los perros no son visibles porque las secciones están plegadas
    expect(screen.queryByText('Bella')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('should show and hide unsponsored dogs on title click', async () => {
    const user = userEvent.setup();
    render(<DogsGrid />);

    // Bella no es visible al inicio
    expect(screen.queryByText('Bella')).not.toBeInTheDocument();

    // Hacemos clic en el título de la sección
    const unsponsoredTitle = screen.getByText('Sin apadrinar');
    await user.click(unsponsoredTitle);

    // Ahora Bella debería ser visible
    expect(screen.getByText('Bella')).toBeInTheDocument();

    // Hacemos clic de nuevo para plegar
    // Re-query the element to avoid using a stale reference after re-render
    await user.click(screen.getByText('Sin apadrinar'));

    // Bella ya no es visible
    expect(screen.queryByText('Bella')).not.toBeInTheDocument();
  });

  it('should show and hide unavailable dogs on title click', async () => {
    const user = userEvent.setup();
    render(<DogsGrid />);

    // Charlie no es visible al inicio
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();

    // Hacemos clic en el título de la sección
    const unavailableTitle = screen.getByText('No disponibles');
    await user.click(unavailableTitle);

    // Ahora Charlie debería ser visible
    expect(screen.getByText('Charlie')).toBeInTheDocument();

    // Hacemos clic de nuevo para plegar
    // Re-query the element to avoid using a stale reference after re-render
    await user.click(screen.getByText('No disponibles'));

    // Charlie ya no es visible
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });
});
