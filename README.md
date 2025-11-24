# Kandexa AI Assistant

Kandexa çatısı altında geliştirilmiş, ChatGPT / Gemini çizgisinde çalışan kişisel yapay zekâ asistanı.  
Node.js backend + sade, gri tonlu bir web arayüzü ile hazırlanmış; portföy ve gerçek kullanım için uygundur.

> **Canlı Demo:**  
> https://kandexa-ai.onrender.com  
>
> **Kaynak Kod (GitHub):**  
> https://github.com/Kandexa/kandexa-ai-assistant

---

## Özellikler

- 🌐 **Canlı çalışan AI** – OpenAI Chat Completions (gpt-4o-mini) ile sohbet
- 🧠 **Otomatik mod algılama**  
  Tek input alanı var; kullanıcı:
  - “sunum”, “slayt” vb. yazarsa → sunum taslağı modu
  - “pdf”, “özet” vb. yazarsa → PDF’lik özet modu
  - Görsel (fotoğraf) gönderirse → görsel analizi (vision) modu
  - Diğer her şey → normal sohbet / Q&A

- 🖼️ **Görsel analizi (Vision)**  
  - Telefonlarda: kamera veya galeriden fotoğraf seçerek  
  - Masaüstünde: dosyadan görsel yükleyerek  
  - Görsel + metin birlikte API’ye gönderilir, model görseli yorumlar.

- 💬 **Chat arayüzü**  
  - Gri tonlarda, karanlık ve sade tasarım
  - Enter = Gönder, Shift+Enter = Alt satır
  - Uzayan sohbetlerde “En alta in” butonu
  - Solda sohbet geçmişi listesi (basit lokal state ile)

- 👤 **Kullanıcı girişi (hafif üyelik)**  
  - İlk açılışta ad + opsiyonel e-posta soran giriş modalı
  - Kullanıcı adı `localStorage` ile saklanıyor
  - Sol alttaki profil kısmı, avatar ve isim kişiye göre güncelleniyor
  - Backend’e her istekle birlikte `userName` gönderiliyor (kişiye göre hitap)

- 📄 **Sohbeti PDF olarak indirme**  
  - jsPDF ile, tüm sohbet geçmişi tek tıkla PDF’e dökülüyor
  - Kullanıcı ve Kandexa AI mesajları prefix’lenmiş şekilde kaydediliyor

- 📱 **Mobil uyumlu tasarım**  
  - Ana layout mobilde sidebar’ı gizleyip chat alanını büyütüyor
  - Mesaj kutusu altta fixed bir “chat bar” gibi davranıyor
  - Fotoğraf butonu: telefonlarda kamera veya galeriyi açarak görsel seçtirebiliyor

---

## Kullanılan Teknolojiler

- **Backend**
  - Node.js
  - Express
  - OpenAI Chat Completions API
  - dotenv (env yönetimi)
  - CORS

- **Frontend**
  - Vanilla HTML, CSS, JavaScript
  - Responsive, mobil uyumlu layout
  - jsPDF (PDF üretimi)

- **Barındırma**
  - Render (Node.js Web Service)
  - Environment Variables üzerinden gizli `OPENAI_API_KEY` yönetimi

---

## Kurulum (Lokalde Çalıştırmak İçin)

Projeyi klonlayın:

```bash
git clone https://github.com/Kandexa/kandexa-ai-assistant.git
cd kandexa-ai-assistant
npm install

Proje klasörüne .env dosyası oluşturun:
OPENAI_API_KEY=BURAYA_KENDI_OPENAI_API_KEYINIZ
PORT=3000

Ardından:
npm start

Tarayıcıdan:
http://localhost:3000

Demo (Render Üzerinde)

Bu proje aynı zamanda Render üzerinde deploy edilmiştir:

Backend + frontend aynı Node.js servisi içinde çalışır.

server.js, Express aracılığıyla public klasöründeki index.html dosyasını sunar.

OPENAI_API_KEY ve PORT değerleri Render üzerinde environment variable olarak tanımlanmıştır.

Canlı adres:https://kandexa-ai.onrender.com

Dosya Yapısı (Kısa Özet)
kandexa-ai-assistant/
  ├─ public/
  │   ├─ index.html    # Arayüz (chat ekranı, giriş modalı)
  │   ├─ style.css     # Gri tonlu, sade ve mobil uyumlu tasarım
  │   └─ app.js        # Chat mantığı, vision, PDF export, sohbet geçmişi
  │
  ├─ server.js         # Node.js backend (Express + OpenAI entegrasyonu)
  ├─ package.json
  ├─ .gitignore        # node_modules ve .env gizleniyor
  └─ README.md

Yol Haritası (Planlanan Geliştirmeler)

 Gerçek üyelik sistemi ve kullanıcıya özel sohbet saklama

 Kod üretme / hata ayıklama için özel “Developer Mode”

 Görsel üretim (DALL·E / Images API) için ek endpoint ve UI

 Premium plan (daha yüksek limitler, daha hızlı yanıt)

 Railway / Vercel gibi platformlarla çoklu region deploy

 UI iyileştirmeleri (tema geçişi, light/dark toggle)

Lisans
Kişisel portföy ve öğrenme amaçlı projedir.
Ticari kullanım için OpenAI kullanım şartlarını ve ilgili lisansları dikkate alınız.

Bunu `README.md` olarak repo’ya ekleyip:

```bash
git add README.md
git commit -m "Add professional README"
git push


