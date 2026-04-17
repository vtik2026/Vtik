const axios = require('axios');
const FormData = require('form-data');
const formidable = require('formidable');
const fs = require('fs');

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // --- إضافة أسطر السماح بالاتصال (CORS) ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error reading file" });
    const video = files.video[0] || files.video;
    
    try {
      const formData = new FormData();
      formData.append('chat_id', process.env.TELEGRAM_CHAT_ID);
      formData.append('video', fs.createReadStream(video.filepath));

      const tgRes = await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendVideo`, formData, {
        headers: formData.getHeaders()
      });

      res.status(200).json({ success: true, file_id: tgRes.data.result.video.file_id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
