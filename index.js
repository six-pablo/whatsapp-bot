const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');

const app = express();
app.use(express.json());

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on('connection.update', (update) => {
    const { qr, connection } = update;

    if (qr) {
      console.log('📱 ESCANEIE ESTE QR CODE NO WHATSAPP:');
      console.log(qr);
    }

    if (connection === 'open') {
      console.log('✅ WhatsApp conectado com sucesso!');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  app.post('/enviar', async (req, res) => {
    const { numero, mensagem } = req.body;

    try {
      await sock.sendMessage(`${numero}@s.whatsapp.net`, { text: mensagem });
      res.json({ status: 'enviado' });
    } catch (e) {
      res.status(500).json({ status: 'erro', erro: e.message });
    }
  });
}

startBot();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 API RODANDO NA PORTA', PORT);
});
