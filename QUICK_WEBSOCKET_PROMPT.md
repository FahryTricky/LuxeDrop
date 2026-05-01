# Quick WebSocket Chat Prompt (Ready to Use)

Gunakan prompt ini saat membuat project baru:

---

## PROMPT UNTUK AI ASSISTANT

```
Saya ingin membuat real-time chat system dengan WebSocket yang support fitur:

1. BACKEND (Node.js + Express + ws library)
   - WebSocket server yang mengelola multiple user connections
   - UserManager class dengan Map untuk track user:
     * userId → {ws, user: {id, name, isOnline}}
     * WebSocket → userId
   - JWT authentication untuk setiap connection
   - Message types:
     * auth: client autentikasi pertama kali
     * message: global broadcast (jika tanpa recipientId) atau private message (jika ada recipientId)
     * typing: typing indicator
     * get_users: request user list
   - Server broadcasts:
     * auth_success: kirim dengan list user lain
     * global_message: broadcast ke semua
     * private_message: ke recipient + echo back ke sender
     * presence: online/offline updates
     * typing: typing indicator
     * error: error messages

2. FRONTEND (React)
   - chatService: singleton WebSocket connection manager
     * startChatStream(handlers): create WebSocket + auto-reconnect dengan exponential backoff
     * sendMessage(text, recipientId?): send message
     * endChatStream(): close connection
     * handler callbacks: onGlobalMessage, onPrivateMessage, onPresenceUpdate, onTypingEvent, onUserList, onError, onEnd
   - ChatContext: React Context untuk manage:
     * Connection status
     * Online users list
     * Conversations (keyed by conversation ID: 'global' atau userId)
     * Typing indicators
     * Active chat context
   - Connection validation: prevent old sockets dari override newer ones

3. MULTI-TAB SUPPORT (PENTING)
   - Setiap tab = instance React app independen
   - Setiap instance punya ChatContext sendiri + WebSocket sendiri
   - Tab 1 login User A → Tab 1's WebSocket auth as A
   - Tab 2 login User B → Tab 2's WebSocket auth as B (TERPISAH dari Tab 1)
   - Server track 2 user connections different dari browser yang sama
   - Token stored per-tab (browser automatically isolate)
   - NO NEED manual tab handling - browser handles it

4. TESTING
   - Multiple users receiving messages
   - Private messages echo-back
   - Typing indicators
   - Multi-tab different accounts (Tab 1 User A + Tab 2 User B)
   - Auto-reconnect
   - Message notifications (suppress jika viewing conversation)

Stack: Node.js, Express, ws library, React, JWT, .env config

Implementasi berdasarkan pattern yang sudah proven (reference: eksisting chat implementation)
```

---

## QUICK START CHECKLIST

Sebelum copypaste prompt di atas, pastikan:

✅ Backend structure sudah ready:
- [ ] `chat-service/` folder dengan `package.json`
- [ ] Express server setup
- [ ] `.env` dengan `JWT_SECRET` dan `WS_HOST`

✅ Frontend structure sudah ready:
- [ ] `frontend/src/services/` untuk chatService
- [ ] `frontend/src/context/` untuk ChatContext
- [ ] `frontend/.env` dengan `VITE_WS_HOST`

✅ Dependencies installed:
```bash
# Backend
npm install ws express jsonwebtoken dotenv

# Frontend
npm install react-dom
```

---

## NOTES FOR NEXT PROJECT

1. **Key Insight**: Multi-tab works karena setiap tab punya WebSocket TERPISAH (bukan shared)
   - NO shared state antara tab (kecuali melalui server broadcast)
   - Token disimpan independently per tab

2. **Type Casting**: Selalu cast userId ke string untuk consistency DB vs JavaScript numbers
   ```javascript
   userId: String(user.id)  // Important!
   ```

3. **Socket Validation**: Setiap event handler check `if (ws !== socket) return;`
   - Prevent old socket override new socket saat reconnect

4. **Echo-Back Pattern**: Private message dikirim ke:
   - recipient (recipient tau message dikirim ke dia)
   - sender (sender confirm message nya berhasil)

5. **Message ID**: Generate unique ID untuk prevent duplicate messages
   ```javascript
   `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
   ```

6. **Auto-Reconnect**: Exponential backoff max 5 attempts
   ```
   3s → 6s → 12s → 24s → 30s (max)
   ```

7. **Notification Suppress**: Show toast ONLY jika:
   - Pesan bukan dari current user
   - User TIDAK viewing percakapan tersebut

8. **Environment Variables**:
   - Backend `.env`: JWT_SECRET, PORT (default 8080)
   - Frontend `.env`: VITE_WS_HOST (ws://localhost:8080)

---

## FILE TO REFERENCE

Di project existing saya, lihat:
- `chat-service/server/websocket-server.js` - Server implementation
- `frontend/src/services/chatService.js` - Frontend WebSocket service
- `frontend/src/context/ChatContext.jsx` - React Context setup

Copy pattern dari files ini untuk next project.

---

## DIAGRAM: How Multi-Tab Works

```
BROWSER CHROME
├── TAB 1: localhost:5173
│   ├── React App Instance 1
│   ├── ChatContext 1 (unique)
│   └── WebSocket Connection 1 (ws://localhost:8080)
│       └── Auth: User A
│           └── Server Register: userId=A, ws=ws1
│
├── TAB 2: localhost:5173 (SAME URL, DIFFERENT TAB)
│   ├── React App Instance 2 (INDEPENDENT)
│   ├── ChatContext 2 (UNIQUE instance)
│   └── WebSocket Connection 2 (ws://localhost:8080) [NEW CONNECTION]
│       └── Auth: User B (DIFFERENT user)
│           └── Server Register: userId=B, ws=ws2
│
└── Tab 1 & Tab 2 BOTH receive server broadcasts
    (tapi via connection masing-masing)

Server Side:
UserManager.users = {
  'A': { ws: ws1, user: {...A data...} },
  'B': { ws: ws2, user: {...B data...} }
}

RESULT:
- Tab 1 (User A) dan Tab 2 (User B) independent
- Close Tab 1 → Tab 2 still connected
- Tab 1 sends message → Tab 2 receives (via server broadcast)
```

---

## COMMON PITFALLS (AVOID)

❌ Sharing single WebSocket antara tabs (WRONG)
❌ Storing token in localStorage without isolation (browser handles this)
❌ Not validating socket identity saat reconnect
❌ Broadcast message ke sender juga untuk ALL messages (hanya private messages)
❌ Forgetting to close old connection saat reconnect
❌ Not debouncing typing indicator (setiap keystroke = message)
❌ Showing notification untuk message diri sendiri
❌ Not handling connection.close() pada old sockets

---

## TESTING COMMANDS

```bash
# Test WebSocket connection
npm install -g wscat
wscat -c ws://localhost:8080

# Send auth message
{"type":"auth","userId":"1","userName":"User1","token":"jwt_token"}

# Send global message
{"type":"message","text":"Hello everyone"}

# Send private message
{"type":"message","text":"Hi there","recipientId":"2"}

# Typing indicator
{"type":"typing","contextId":"2","isTyping":true}
```

---

## VIDEO ANALOGY

Bayangkan seperti restaurant dengan multiple waiter (tab):

- Restaurant = Server
- Waiter 1 = Tab 1 (User A connection)
- Waiter 2 = Tab 2 (User B connection)
- Table = Users chatting

Saat waiter 1 (Tab 1) dapat order, dia bilang ke manager (server):
"Order dari User A: pesan ini untuk semua atau ke User B?"

Manager broadcast atau forward sesuai:
- Ke semua table: broadcast
- Ke table tertentu: forward private

Setiap waiter independent (different phone lines untuk each tab).
Jika waiter 1 pergi (close Tab 1), waiter 2 masih bisa ambil order (Tab 2 still works).

---

## READY TO USE!

Copy prompt di section "PROMPT UNTUK AI ASSISTANT" langsung ke:
- GitHub Copilot Chat
- ChatGPT
- Claude
- Gemini

Dan edit sesuai kebutuhan project Anda.
Prompt sudah tested dan proven bekerja! 🚀
```
