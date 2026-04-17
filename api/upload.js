const axios = require('axios');
const FormData = require('form-data');
const formidable = require('formidable');
const fs = require('fs');

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const form = new formidable.IncomingForm();
  form.maxFileSize = 50 * 1024 * 1024; // حد أقصى 50 ميجا

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "حجم الفيديو كبير جداً" });
    
    const video = files.video[0] || files.video;
    if (!video) return res.status(400).json({ error: "لم يتم استلام فيديو" });

    try {
      const formData = new FormData();
      formData.append('chat_id', process.env.TELEGRAM_CHAT_ID);
      formData.append('video', fs.createReadStream(video.filepath));

      const tgRes = await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendVideo`, formData, {
        headers: formData.getHeaders(),
        timeout: 60000 // دقيقة كاملة للرفع
      });

      res.status(200).json({ success: true, file_id: tgRes.data.result.video.file_id });
    } catch (error) {
      res.status(500).json({ error: "فشل تليجرام: " + (error.response?.data?.description || error.message) });
    }
  });
}
