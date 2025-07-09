import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { ErrorMessage } from "../ErrorMessage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ErrorMessage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("deve exibir mensagem de erro", () => {
    renderWithRouter(<ErrorMessage message="Erro de teste" />);

    expect(screen.getByText("Erro de teste")).toBeInTheDocument();
    expect(screen.getByText("Ops! Algo deu errado")).toBeInTheDocument();
  });

  it('deve exibir botão "Voltar ao início" por padrão', () => {
    renderWithRouter(<ErrorMessage message="Erro de teste" />);

    expect(screen.getByText("Voltar ao início")).toBeInTheDocument();
  });

  it('deve navegar para home ao clicar em "Voltar ao início"', () => {
    renderWithRouter(<ErrorMessage message="Erro de teste" />);

    const homeButton = screen.getByText("Voltar ao início");
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("deve exibir botão de retry quando fornecido", () => {
    const mockRetry = vi.fn();

    renderWithRouter(
      <ErrorMessage
        message="Erro de teste"
        onRetry={mockRetry}
        retryText="Tentar novamente"
      />
    );

    expect(screen.getByText("Tentar novamente")).toBeInTheDocument();
  });

  it("deve chamar função de retry ao clicar no botão", () => {
    const mockRetry = vi.fn();

    renderWithRouter(
      <ErrorMessage message="Erro de teste" onRetry={mockRetry} />
    );

    const retryButton = screen.getByText("Tentar novamente");
    fireEvent.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it("deve ocultar botão home quando showHomeButton for false", () => {
    renderWithRouter(
      <ErrorMessage message="Erro de teste" showHomeButton={false} />
    );

    expect(screen.queryByText("Voltar ao início")).not.toBeInTheDocument();
  });
});
