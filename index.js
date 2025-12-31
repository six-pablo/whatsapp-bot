const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.use(express.json());

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  console.log('QR_CODE');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WHATSAPP_CONECTADO');
});

client.initialize();

app.post('/enviar', async (req, res) => {
  const { numero, mensagem } = req.body;

  try {
    await client.sendMessage(`${numero}@c.us`, mensagem);
    res.json({ status: 'enviado' });
  } catch (e) {
    res.status(500).json({ status: 'erro', erro: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('API_RODANDO');
});
