import whatsAppService from '../services/whatsapp';

// Exemplo de envio de mensagem de texto
async function enviarMensagemTexto() {
  try {
    const resultado = await whatsAppService.sendTextMessage(
      '5511999999999',  // Número do destinatário
      'Olá! Esta é uma mensagem de teste do SigerChat.'
    );
    console.log('Mensagem enviada com sucesso:', resultado);
  } catch (erro) {
    console.error('Erro ao enviar mensagem:', erro);
  }
}

// Exemplo de envio de mensagem de template
async function enviarMensagemTemplate() {
  try {
    const resultado = await whatsAppService.sendTemplateMessage(
      '5511999999999',  // Número do destinatário
      'hello_world',    // Nome do template
      'pt_BR',          // Código do idioma
      [                 // Componentes do template (opcional)
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: 'João'
            }
          ]
        }
      ]
    );
    console.log('Template enviado com sucesso:', resultado);
  } catch (erro) {
    console.error('Erro ao enviar template:', erro);
  }
}

// Exemplo de uso
enviarMensagemTexto();
enviarMensagemTemplate(); 