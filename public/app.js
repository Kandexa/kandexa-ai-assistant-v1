const chatEl = document.getElementById("chat");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const attachBtn = document.getElementById("attach-image");
const imageInput = document.getElementById("image-input");
const imageLabel = document.getElementById("image-label");
const pdfExportBtn = document.getElementById("export-pdf");
const newChatBtn = document.getElementById("new-chat");
const convoListEl = document.getElementById("conversation-list");
const scrollBottomBtn = document.getElementById("scroll-bottom");
const introEl = document.getElementById("intro");

// Login / profil
const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const loginNameInput = document.getElementById("login-name");
const loginEmailInput = document.getElementById("login-email");
const userNameDisplay = document.getElementById("user-name-display");
const userAvatar = document.getElementById("user-avatar");
const profileBtn = document.getElementById("profile-btn");

let imageBase64 = null;
let messagesHistory = []; // aktif sohbet
let conversations = []; // geçmiş sohbetler
let activeConversationId = null;
let currentUserName = "Misafir";
let currentUserEmail = "";

// --- Kullanıcı adı / profil ---

function applyUserToUI() {
  userNameDisplay.textContent = currentUserName || "Misafir";
  const firstLetter = (currentUserName || "U").charAt(0).toUpperCase();
  userAvatar.textContent = firstLetter;
}

function loadUserFromStorage() {
  const storedName = localStorage.getItem("kandexaUserName");
  const storedEmail = localStorage.getItem("kandexaUserEmail");
  if (storedName) {
    currentUserName = storedName;
    currentUserEmail = storedEmail || "";
    applyUserToUI();
    loginModal.style.display = "none";
  } else {
    loginModal.style.display = "flex";
  }
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = loginNameInput.value.trim();
  const email = loginEmailInput.value.trim();

  if (!name) return;

  currentUserName = name;
  currentUserEmail = email;
  localStorage.setItem("kandexaUserName", name);
  if (email) localStorage.setItem("kandexaUserEmail", email);

  applyUserToUI();
  loginModal.style.display = "none";
});

profileBtn.addEventListener("click", () => {
  loginNameInput.value = currentUserName !== "Misafir" ? currentUserName : "";
  loginEmailInput.value = currentUserEmail || "";
  loginModal.style.display = "flex";
});

// --- Chat yardımcı fonksiyonlar ---

function scrollToBottom() {
  chatEl.scrollTop = chatEl.scrollHeight;
}

function updateScrollButton() {
  const nearBottom =
    chatEl.scrollHeight - chatEl.scrollTop - chatEl.clientHeight < 80;
  scrollBottomBtn.style.display = nearBottom ? "none" : "block";
}

chatEl.addEventListener("scroll", updateScrollButton);

function addMessage(role, text) {
  if (introEl) introEl.style.display = "none";

  const div = document.createElement("div");
  div.classList.add("message", role === "user" ? "user" : "ai");

  const roleSpan = document.createElement("span");
  roleSpan.classList.add("role");
  roleSpan.textContent = role === "user" ? currentUserName : "Kandexa AI";

  const content = document.createElement("div");
  content.textContent = text;

  div.appendChild(roleSpan);
  div.appendChild(content);
  chatEl.appendChild(div);

  messagesHistory.push({ role, text });
  scrollToBottom();
  updateScrollButton();
}

function renderConversationList() {
  convoListEl.innerHTML = "";

  if (conversations.length === 0) {
    const div = document.createElement("div");
    div.className = "empty-state";
    div.textContent = "Henüz kayıtlı sohbet yok.";
    convoListEl.appendChild(div);
    return;
  }

  conversations.forEach((c) => {
    const item = document.createElement("div");
    item.className = "conversation-item";
    if (c.id === activeConversationId) item.classList.add("active");
    item.textContent = c.title;
    item.onclick = () => {
      activeConversationId = c.id;
      messagesHistory = [...c.messages];
      chatEl.innerHTML = "";
      if (introEl) introEl.style.display = "none";
      messagesHistory.forEach((m) => addMessage(m.role, m.text));
      renderConversationList();
    };
    convoListEl.appendChild(item);
  });
}

function startNewChat() {
  if (messagesHistory.length > 0) {
    const title =
      messagesHistory.find((m) => m.role === "user")?.text.slice(0, 40) ||
      "Yeni sohbet";
    conversations.unshift({
      id: Date.now().toString(),
      title,
      messages: [...messagesHistory],
    });
  }

  messagesHistory = [];
  activeConversationId = null;
  chatEl.innerHTML = "";
  imageBase64 = null;
  imageInput.value = "";
  imageLabel.textContent =
    "Görsel yok (telefonlarda kamera veya galeriden seçebilirsin)";
  if (introEl) introEl.style.display = "block";

  renderConversationList();
}

newChatBtn.addEventListener("click", startNewChat);

// Görsel ekleme butonu (kamera / galeri)
attachBtn.addEventListener("click", () => {
  imageInput.click();
});

// Dosya seçilince
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) {
    imageBase64 = null;
    imageLabel.textContent =
      "Görsel yok (telefonlarda kamera veya galeriden seçebilirsin)";
    return;
  }

  if (file.size > 4 * 1024 * 1024) {
    alert("Lütfen 4MB'den küçük bir görsel seç.");
    imageInput.value = "";
    imageBase64 = null;
    imageLabel.textContent =
      "Görsel yok (telefonlarda kamera veya galeriden seçebilirsin)";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result.split(",")[1];
    imageBase64 = base64String;
    imageLabel.textContent = `Seçilen: ${file.name}`;
  };
  reader.readAsDataURL(file);
});

// Enter ile gönder (Shift+Enter yeni satır)
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});

// Form submit
formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();

  if (!text && !imageBase64) {
    alert("Önce bir metin yaz veya fotoğraf seç.");
    return;
  }

  addMessage("user", text || "[Sadece görsel gönderildi]");
  inputEl.value = "";
  inputEl.focus();

  addMessage("ai", "Düşünüyorum...");
  sendBtn.disabled = true;

  try {
    const payload = {
      message: text,
      imageBase64,
      userName: currentUserName,
    };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Son eklenen "Düşünüyorum..." mesajını sil
    chatEl.removeChild(chatEl.lastChild);
    messagesHistory.pop();

    if (!res.ok) {
      addMessage("ai", "Bir hata oluştu. Lütfen tekrar dene.");
      return;
    }

    const data = await res.json();
    addMessage("ai", data.reply || "(boş cevap)");

    // Aktif sohbeti güncelle
    if (activeConversationId) {
      const idx = conversations.findIndex((c) => c.id === activeConversationId);
      if (idx !== -1) {
        conversations[idx].messages = [...messagesHistory];
      }
    }
  } catch (err) {
    console.error(err);
    addMessage("ai", "Sunucuya ulaşırken bir hata oluştu.");
  } finally {
    sendBtn.disabled = false;
  }
});

// Sohbeti PDF olarak indir
pdfExportBtn.addEventListener("click", () => {
  if (messagesHistory.length === 0) {
    alert("Önce birkaç mesaj yaz, sonra PDF alabilirsin.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const marginLeft = 40;
  let y = 40;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Kandexa AI Sohbet Özeti", marginLeft, y);
  y += 24;

  doc.setFontSize(11);

  messagesHistory.forEach(({ role, text }) => {
    const prefix =
      role === "user" ? `${currentUserName}: ` : "Kandexa AI: ";
    const wrapped = doc.splitTextToSize(prefix + text, 515);

    if (y + wrapped.length * 14 > 800) {
      doc.addPage();
      y = 40;
    }

    doc.text(wrapped, marginLeft, y);
    y += wrapped.length * 14 + 10;
  });

  doc.save("kandexa-ai-sohbet.pdf");
});

// En alta in
scrollBottomBtn.addEventListener("click", scrollToBottom);

// Başlangıç
loadUserFromStorage();
renderConversationList();
updateScrollButton();