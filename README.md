# SigerChat 💬

O SigerChat é uma aplicação de chat moderna que integra com a API do WhatsApp Business, permitindo o envio e recebimento de mensagens através de uma interface web amigável. Esta aplicação é construída com foco em escalabilidade e manutenibilidade.

## 🚀 Funcionalidades

- ✅ Integração com WhatsApp Business API
- 📱 Interface responsiva e moderna
- 💬 Suporte a diferentes tipos de mensagens:
  - Mensagens de texto
  - Templates
  - Mensagens interativas (botões e listas)
  - Imagens
- 🔒 Gestão segura de tokens e configurações

## 🛠️ Tecnologias Utilizadas

- **React**: Biblioteca para construção de interfaces de usuário.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **WhatsApp Business API**: API para integração com o WhatsApp.
- **Axios**: Biblioteca para requisições HTTP.
- **Styled Components**: Biblioteca para estilização de componentes.

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Conta no WhatsApp Business API
- Token de acesso do WhatsApp Business

## 🔧 Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/sigerchat.git
cd sigerchat
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto
- Adicione as seguintes variáveis:
```env
WHATSAPP_ACCESS_TOKEN=seu_token_aqui
```

4. Inicie o projeto:
```bash
npm start
# ou
yarn start
```

## 📱 Exemplos de Uso da API

### Enviar Mensagem de Texto
```typescript
import { WhatsAppService } from './services/WhatsAppService';

const whatsAppService = new WhatsAppService();

const response = await whatsAppService.sendTextMessage(
  "5511999999999",
  "Olá! Esta é uma mensagem de teste."
);
console.log(response);
```

### Enviar Template
```typescript
const response = await whatsAppService.sendTemplateMessage(
  "5511999999999",
  "hello_world",
  "pt_BR"
);
console.log(response);
```

## 📂 Estrutura do Projeto

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas, por favor abra uma issue no repositório ou entre em contato através do email: [seu-email@exemplo.com]

## 🔗 Links Úteis:
- [Documentação WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
