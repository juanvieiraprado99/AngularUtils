import type { Meta, StoryObj } from '@storybook/angular';
import { HighlightDemoComponent } from './highlight-demo.component';

const meta: Meta<HighlightDemoComponent> = {
  title: 'Components/Highlight Demo',
  component: HighlightDemoComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<HighlightDemoComponent>;

export const Default: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. São Paulo é uma cidade grande!',
  },
};

export const LongText: Story = {
  args: {
    text: `
      Este é um texto mais longo para demonstrar o highlight em parágrafos maiores.

      Você pode procurar por palavras como "texto", "demonstrar", "highlight" e ver
      como o componente lida com diferentes situações.

      Alguns casos especiais para testar:
      - Palavras com acentos: São Paulo, México, João
      - Palavras compostas: guarda-chuva, bem-vindo
      - Palavras em MAIÚSCULAS e minúsculas
      - Palavras com números: teste123, 456teste
    `,
  },
};

export const WithSpecialCharacters: Story = {
  args: {
    text: `
      Caracteres especiais: !@#$%^&*()
      Acentuação: áéíóú ÁÉÍÓÚ âêîôû ÂÊÎÔÛ ãõ ÃÕ
      Pontuação: .,;:!?
      Números: 0123456789
      Símbolos: ©®™℠
    `,
  },
};

export const CodeExample: Story = {
  args: {
    text: `
      function exemplo() {
        const texto = "Olá mundo!";
        console.log(texto);
        return texto.toUpperCase();
      }
    `,
  },
};

// Documentação adicional
Default.parameters = {
  docs: {
    description: {
      story: `
Este é um componente de demonstração para o HighlightPipe.
Ele permite testar todas as opções disponíveis do pipe em tempo real.

### Funcionalidades
- Busca com ou sem case sensitive
- Suporte a palavras inteiras ou parciais
- Normalização de acentos
- Diferentes estilos de highlight
- Tags HTML customizáveis

### Como usar
1. Digite um termo de busca no campo de texto
2. Ajuste as opções conforme necessário
3. Observe o resultado em tempo real
      `,
    },
  },
};
