import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { CryptoCard } from '../CryptoCard';
import { Cryptocurrency } from '../../types/crypto';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCrypto: Cryptocurrency = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.com/bitcoin.png',
  current_price: 250000,
  market_cap_rank: 1,
  price_change_percentage_24h: 5.25,
  market_cap: 5000000000,
  fully_diluted_valuation: null,
  total_volume: 1000000000,
  high_24h: 260000,
  low_24h: 240000,
  price_change_24h: 12500,
  market_cap_change_24h: 100000000,
  market_cap_change_percentage_24h: 2.1,
  circulating_supply: 19000000,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 300000,
  ath_change_percentage: -16.67,
  ath_date: '2024-01-01T00:00:00.000Z',
  atl: 100,
  atl_change_percentage: 250000,
  atl_date: '2010-07-01T00:00:00.000Z',
  roi: null,
  last_updated: '2025-01-01T00:00:00.000Z',
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CryptoCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('deve renderizar informações básicas da criptomoeda', () => {
    renderWithRouter(<CryptoCard crypto={mockCrypto} />);
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    // O símbolo é renderizado em lowercase como "btc", não "BTC"
    expect(screen.getByText('btc')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Sem o #
    expect(screen.getByText('R$ 250.000,00')).toBeInTheDocument();
  });

  it('deve exibir variação positiva em verde', () => {
    renderWithRouter(<CryptoCard crypto={mockCrypto} />);
    
    const changeElement = screen.getByText('+5,25%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveClass('text-green-500');
  });

  it('deve exibir variação negativa em vermelho', () => {
    const negativeCrypto = {
      ...mockCrypto,
      price_change_percentage_24h: -3.45
    };
    
    renderWithRouter(<CryptoCard crypto={negativeCrypto} />);
    
    const changeElement = screen.getByText('-3,45%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveClass('text-red-500');
  });

  it('deve navegar para página de detalhes ao clicar', () => {
    renderWithRouter(<CryptoCard crypto={mockCrypto} />);
    
    // O card não é um button, é uma div clicável
    const card = screen.getByText('Bitcoin').closest('div[class*="cursor-pointer"]');
    expect(card).toBeInTheDocument();
    fireEvent.click(card!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/coin/bitcoin');
  });

  it('deve exibir imagem da criptomoeda com alt text correto', () => {
    renderWithRouter(<CryptoCard crypto={mockCrypto} />);
    
    const image = screen.getByAltText('Bitcoin');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/bitcoin.png');
  });
});