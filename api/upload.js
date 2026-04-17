const axios = require('axios');
const FormData = require('form-data');
const formidable = require('formidable');
const fs = require('fs');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();
  
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Error parsing form" });
        return resolve();
      }

      const video = files.video[0] || files.video; 
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      if (!video || !BOT_TOKEN || !CHAT_ID) {
        res.status(400).json({ error: "Missing file or configuration" });
        return resolve();
      }

      try {
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('video', fs.createReadStream(video.filepath));

        const tgRes = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, formData, {
          headers: formData.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        });

        res.status(200).json({ 
          success: true, 
          file_id: tgRes.data.result.video.file_id 
        });
        resolve();
      } catch (error) {
        res.status(500).json({ error: error.message });
        resolve();
      }
    });
  });
}
