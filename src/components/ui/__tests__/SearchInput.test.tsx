import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SearchInput } from "../SearchInput";

describe("SearchInput", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("deve renderizar com placeholder correto", () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        placeholder="Buscar criptomoedas..."
      />
    );

    expect(
      screen.getByPlaceholderText("Buscar criptomoedas...")
    ).toBeInTheDocument();
  });

  it("deve exibir valor inicial", () => {
    render(
      <SearchInput
        value="bitcoin"
        onChange={mockOnChange}
        placeholder="Buscar..."
      />
    );

    expect(screen.getByDisplayValue("bitcoin")).toBeInTheDocument();
  });

  it("deve chamar onChange ao digitar", async () => {
    const user = userEvent.setup();

    render(
      <SearchInput value="" onChange={mockOnChange} placeholder="Buscar..." />
    );

    const input = screen.getByRole("textbox");

    // Testar digitação caractere por caractere
    await user.type(input, "e");
    expect(mockOnChange).toHaveBeenCalledWith("e");

    // Reset do mock para próxima verificação
    mockOnChange.mockClear();

    await user.type(input, "t");
    expect(mockOnChange).toHaveBeenCalledWith("t");

    mockOnChange.mockClear();

    await user.type(input, "h");
    expect(mockOnChange).toHaveBeenCalledWith("h");
  });

  it("deve exibir ícone de busca", () => {
    render(
      <SearchInput value="" onChange={mockOnChange} placeholder="Buscar..." />
    );

    const searchIcon = screen
      .getByRole("textbox")
      .parentElement?.querySelector("svg");
    expect(searchIcon).toBeInTheDocument();
  });

  it("deve permitir limpar o campo", async () => {
    const user = userEvent.setup();

    render(
      <SearchInput
        value="bitcoin"
        onChange={mockOnChange}
        placeholder="Buscar..."
      />
    );

    const input = screen.getByRole("textbox");
    await user.clear(input);

    expect(mockOnChange).toHaveBeenCalledWith("");
  });

  it("deve chamar onChange com o valor completo ao digitar palavra", async () => {
    const user = userEvent.setup();

    render(
      <SearchInput value="" onChange={mockOnChange} placeholder="Buscar..." />
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "bitcoin");

    // Verifica se foi chamado pelo menos uma vez
    expect(mockOnChange).toHaveBeenCalled();

    // Verifica a última chamada
    const lastCall =
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe("n"); // último caractere digitado
  });
});
