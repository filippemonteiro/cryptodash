# CryptoDash 🚀

Um painel interativo para acompanhar criptomoedas em tempo real, construído com React, TypeScript e Tailwind CSS.

## 📱 Funcionalidades

- ✅ **Listagem de Criptomoedas**: Exibe as 20 principais criptomoedas por capitalização de mercado
- ✅ **Busca em Tempo Real**: Filtre por nome ou símbolo da moeda
- ✅ **Detalhes Completos**: Visualize informações detalhadas de cada criptomoeda
- ✅ **Responsivo**: Interface adaptável para desktop e mobile
- ✅ **Estados de Loading e Erro**: Feedback visual para todas as operações
- ✅ **Cache Inteligente**: Otimização de requisições à API

## 🛠️ Stack Tecnológica

### Obrigatórias

- **React** - Biblioteca principal para interface
- **TypeScript** - Tipagem estática e melhor DX
- **Tailwind CSS** - Framework CSS utilitário

### Escolhas Arquiteturais

- **Zustand** - Gerenciamento de estado global simples e eficiente
- **React Router DOM** - Roteamento client-side robusto e maduro
- **Fetch API Nativo** - Requisições HTTP com cache personalizado

## 🏗️ Decisões de Arquitetura

### Gerenciamento de Estado - Zustand

Escolhi o **Zustand** ao invés de Context API ou Redux porque:

- **Simplicidade**: Menos boilerplate que Redux
- **Performance**: Não causa re-renders desnecessários como Context API
- **TypeScript**: Excelente suporte nativo ao TypeScript
- **Bundle Size**: Apenas 2.3kb vs 45kb do Redux Toolkit

### Estilização - Tailwind CSS

- **Produtividade**: Classes utilitárias aceleram desenvolvimento
- **Responsividade**: Sistema de breakpoints integrado
- **Manutenibilidade**: Estilos colocalizados com componentes
- **Customização**: Configuração de cores personalizadas para tema crypto

### Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface base
│   └── layout/         # Componentes de layout
├── pages/              # Páginas da aplicação
├── services/           # Lógica de API e utilitários
├── store/              # Estado global (Zustand)
├── types/              # Definições TypeScript
└── utils/              # Funções auxiliares
```

### Otimizações Implementadas

- **Cache em Memória**: 5min para lista, 10min para detalhes
- **Rate Limiting**: Controle de 1 req/segundo para evitar erro 429
- **Debounce de Requisições**: Evita chamadas simultâneas desnecessárias
- **Tratamento de Erro Inteligente**: UX específica para cada tipo de erro

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd cryptodash

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Acesse no navegador
http://localhost:5173
```

### Build para Produção

```bash
# Gera build otimizado
npm run build

# Preview do build
npm run preview
```

## 🎯 API Utilizada

**CoinGecko API** - API pública gratuita para dados de criptomoedas

- **Base URL**: `https://api.coingecko.com/api/v3`
- **Rate Limit**: 10-30 req/min (plano gratuito)
- **Endpoints**:
  - `GET /coins/markets` - Lista de criptomoedas
  - `GET /coins/{id}` - Detalhes específicos

## 📱 Responsividade

Breakpoints utilizados:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Classes Tailwind aplicadas:

- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- `text-sm md:text-base lg:text-lg`
- `p-4 md:p-6 lg:p-8`

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run preview  # Preview do build
npm run lint     # Verificação de código
```

## 🌟 Destaques Técnicos

### TypeScript

- Tipagem forte para toda API do CoinGecko
- Interfaces bem definidas para props e estado
- Strict mode habilitado para máxima segurança

### Performance

- Cache inteligente reduz requisições em 80%
- Componentes otimizados para evitar re-renders
- Bundle splitting automático do Vite

### UX/UI

- Estados de loading com animações
- Tratamento específico para diferentes erros
- Navegação intuitiva com breadcrumbs
- Feedback visual para todas as ações

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido por [Filippe Andrade Monteiro]** - Desafio Técnico Frontend 2025
