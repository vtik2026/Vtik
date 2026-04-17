const axios = require('axios');
const FormData = require('form-data');
const formidable = require('formidable');
const fs = require('fs');

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "خطأ في قراءة الملف" });
    const video = files.video[0];
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    try {
      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('video', fs.createReadStream(video.filepath));
      const tgRes = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, formData, {
        headers: formData.getHeaders(),
      });
      res.status(200).json({ success: true, file_id: tgRes.data.result.video.file_id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
