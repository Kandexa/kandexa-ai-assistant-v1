// server.js - Kandexa AI backend (CommonJS)
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("HATA: OPENAI_API_KEY .env dosyasında tanımlı değil!");
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// public klasörünü statik olarak sun
app.use(express.static(path.join(__dirname, "public")));

// Ana chat endpoint'i
app.post("/api/chat", async (req, res) => {
  try {
    const { message, imageBase64, userName } = req.body;

    if (!message && !imageBase64) {
      return res
        .status(400)
        .json({ error: "En az bir metin veya görsel göndermelisin." });
    }

    const text = message || "";

    // --- Basit otomatik mod tespiti ---
    let detectedMode = "chat";

    if (imageBase64) {
      detectedMode = "vision";
    } else if (/(slayt|sunum)/i.test(text)) {
      detectedMode = "presentation";
    } else if (/(pdf|özet)/i.test(text)) {
      detectedMode = "pdf";
    }

    // --- Sistem mesajı ---
    let systemContent =
      "You are Kandexa AI, a helpful and honest assistant. " +
      "Always answer in the same language as the user. " +
      "If the user writes in Turkish, answer in Turkish. ";

    if (userName) {
      systemContent += `The user's name is ${userName}. `;
    }

    if (detectedMode === "presentation") {
      systemContent +=
        "Kullanıcının yazdıklarını slayt taslağına dönüştür. " +
        "Slide 1: Başlık\nSlide 2: ... şeklinde düzenli ve profesyonel liste ver.";
    } else if (detectedMode === "pdf") {
      systemContent +=
        "Metni PDF'ye uygun olacak şekilde başlıklar, alt başlıklar ve maddelerle özetle. " +
        "Kısa, net ve okunaklı olsun.";
    } else if (detectedMode === "vision") {
      systemContent +=
        "Kullanıcının yüklediği görseli ayrıntılı ve anlaşılır şekilde analiz et, sorusuna göre cevap ver.";
    }

    // --- Mesaj gövdesi ---
    let messages;

    if (imageBase64 && detectedMode === "vision") {
      messages = [
        { role: "system", content: systemContent },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: text || "Bu görseli analiz et.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ];
    } else {
      messages = [
        { role: "system", content: systemContent },
        { role: "user", content: text },
      ];
    }

    // --- OpenAI Chat Completions çağrısı ---
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API hata:", errText);
      return res.status(500).json({ error: "OpenAI API hatası oluştu." });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Yanıt üretilemedi, lütfen tekrar dene.";

    res.json({ reply });
  } catch (err) {
    console.error("Sunucu hatası:", err);
    res.status(500).json({ error: "Sunucu hatası oluştu." });
  }
});

app.listen(PORT, () => {
  console.log(`Kandexa AI server http://localhost:${PORT} üzerinde çalışıyor...`);
});