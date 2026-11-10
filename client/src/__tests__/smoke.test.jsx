import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../MainPage';
import ActionPoints from '../components/ActionPoints';

// MainPage opens a socket at import time; don't try to reach a real server in tests.
vi.mock('socket.io-client', () => ({
  io: () => ({ on: vi.fn(), off: vi.fn(), emit: vi.fn() }),
}));

const renderMenu = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/local-game" element={<div>Local game screen</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('Main menu', () => {
  it('renders the title, name input and both game modes', () => {
    renderMenu();
    expect(screen.getByAltText('Enchanted Wars')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Find Match' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Local Match' })).toBeInTheDocument();
  });

  it('only enables Find Match once a name is entered', () => {
    renderMenu();
    const findMatch = screen.getByRole('button', { name: 'Find Match' });
    expect(findMatch).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Ayush' } });
    expect(findMatch).toBeEnabled();
  });

  it('Local Match navigates to the local game', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Local Match' }));
    expect(screen.getByText('Local game screen')).toBeInTheDocument();
  });
});

describe('ActionPoints', () => {
  it('shows the starting 3 points', () => {
    render(<ActionPoints points={3} />);
    expect(screen.getByText('Action Points: 3')).toBeInTheDocument();
  });
});
