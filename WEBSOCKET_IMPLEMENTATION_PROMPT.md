# WebSocket Real-Time Chat Implementation Prompt

## Fitur Utama
- **Real-time Chat**: Pesan global (broadcast) dan private message antara user
- **Multi-Tab Support**: Setiap tab dapat login dengan akun berbeda tanpa conflict
- **User Presence**: Notifikasi online/offline status
- **Typing Indicator**: Tampilkan indicator ketika user sedang mengetik
- **JWT Authentication**: Secure WebSocket connection dengan JWT token
- **Auto-Reconnect**: Otomatis reconnect dengan exponential backoff jika connection lost
- **Message History**: Simpan percakapan per tab/session

---

## Arsitektur Teknis

### Backend: WebSocket Server (Node.js + ws library)

#### 1. UserManager Class
**Fungsi**: Mengelola semua user yang terkoneksi
**Data Structure**:
```javascript
// Map userId → { ws: WebSocket, user: { id, name, isOnline } }
this.users = new Map();

// Map WebSocket → userId (untuk lookup cepat saat disconnect)
this.socketToUser = new Map();
```

**Methods**:
- `addUser(ws, userId, userName)`: Register user baru
  - Jika user sudah connected, tutup koneksi lama (handle reconnect/multi-tab)
  - Return user object dengan metadata
- `removeUser(ws)`: Remove user saat disconnect
- `getUser(userId)`: Get user data by ID
- `getUserBySocket(ws)`: Get user data by WebSocket
- `getAllUsers()`: List semua user online
- `getOtherUsers(excludeUserId)`: List user lain (exclude current user)
- `broadcast(message, excludeUserId?)`: Kirim ke semua user (optional exclude)
- `sendToUser(userId, message)`: Kirim ke user tertentu by ID
- `sendToSocket(ws, message)`: Kirim ke WebSocket tertentu

#### 2. JWT Authentication
- Verify JWT token saat client mengirim auth message
- Decode token untuk validasi identity
- Allow dev mode (tanpa JWT) untuk development
- Reject connection jika token invalid/expired

#### 3. Message Protocol (JSON-based)

**Client → Server**:
```javascript
// Auth message - WAJIB dikirim pertama setelah connect
{ type: 'auth', userId: string, userName: string, token: string }

// Send message
{ type: 'message', text: string, recipientId?: string, id?: string }
// recipientId = undefined → global message
// recipientId = userId → private message

// Typing indicator
{ type: 'typing', contextId: string, isTyping: boolean }

// Get user list
{ type: 'get_users' }
```

**Server → Client**:
```javascript
// Auth success - kirim setelah autentikasi berhasil
{ type: 'auth_success', users: User[] }

// Global message - broadcast
{ type: 'global_message', id: string, sender: User, text: string, timestamp: number }

// Private message - direct message
{ type: 'private_message', id: string, sender: User, recipient: User, text: string, timestamp: number }

// Presence update - user online/offline
{ type: 'presence', user: User, isOnline: boolean, timestamp: number }

// Typing indicator
{ type: 'typing', user: User, contextId: string, isTyping: boolean, timestamp: number }

// User list update
{ type: 'user_list', users: User[] }

// Message confirmation
{ type: 'message_sent', success: boolean, messageId: string }

// Error
{ type: 'error', message: string }
```

#### 4. Server Implementation Steps

1. **Setup Express + WebSocket Server**
   ```javascript
   import express from 'express';
   import { createServer } from 'http';
   import { WebSocketServer } from 'ws';
   
   const app = express();
   const server = createServer(app);
   const wss = new WebSocketServer({ server });
   ```

2. **Instantiate UserManager**
   ```javascript
   const userManager = new UserManager();
   ```

3. **Handle WebSocket Connections**
   ```javascript
   wss.on('connection', (ws, request) => {
     let isAuthenticated = false;
     
     ws.on('message', (data) => {
       const parsed = JSON.parse(data.toString());
       
       // Handle different message types
       if (parsed.type === 'auth') {
         // Verify JWT
         // Add user to userManager
         isAuthenticated = true;
         // Send auth_success + user list
       }
       
       if (!isAuthenticated) {
         // Reject non-auth messages
         return;
       }
       
       // Handle message, typing, get_users, etc.
     });
     
     ws.on('close', () => {
       const user = userManager.removeUser(ws);
       // Broadcast presence offline
     });
   });
   ```

5. **Message Handlers**
   - **Global Message**: Broadcast ke semua user termasuk sender
   - **Private Message**: Send ke recipient + echo back ke sender
   - **Typing**: Broadcast typing indicator ke semua (atau ke recipient saja)
   - **Presence**: Broadcast saat user connect/disconnect

---

### Frontend: React with Chat Context

#### 1. Chat Service (Singleton)
**Fungsi**: Mengelola WebSocket connection per user session

**State Management**:
```javascript
let ws = null; // Single WebSocket instance per tab
let reconnectAttempts = 0;
let reconnectTimer = null;
let isIntentionalClose = false;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // Exponential backoff
```

**Key Methods**:
- `startChatStream(handlers)`: 
  - Validate user authenticated
  - Create WebSocket connection
  - Send auth message
  - Setup event handlers (onGlobalMessage, onPrivateMessage, onPresenceUpdate, onTypingEvent, onUserList, onError, onEnd)
  - Return cancel function

- `endChatStream()`: 
  - Close WebSocket intentionally
  - Clear reconnect timer

- `sendMessage(text, recipientId?)`: 
  - Send message (global if no recipientId)
  - Handle message_sent confirmation

- `sendTypingIndicator(contextId, isTyping)`: 
  - Send typing indicator

- `_handleServerMessage(data)`: 
  - Route pesan ke handler yang sesuai
  - Parse sender/recipient data

#### 2. Connection Lifecycle

```
Tab1 Login with User A
  ↓
ChatContext created in Tab1
  ↓
startChatStream() called
  ↓
WebSocket connected
  ↓
Send auth {userId: A, userName, token}
  ↓
Server: UserManager.addUser(ws, A, ...)
  ↓
Receive auth_success + user list
  ↓
Tab2 Login with User B (SAME BROWSER/CHROME)
  ↓
ChatContext created in Tab2 (INDEPENDENT instance)
  ↓
startChatStream() called in Tab2
  ↓
NEW WebSocket connection created (separate from Tab1)
  ↓
Send auth {userId: B, userName, token} (DIFFERENT token)
  ↓
Server: UserManager.addUser(ws_new, B, ...) (B added as SEPARATE user)
  ↓
Both Tab1 (User A) and Tab2 (User B) receive presence updates
  ↓
Each tab receives its own message streams independently
```

#### 3. Chat Context (React Context API)

**Stores**:
- `isConnected`: Boolean connection status
- `users`: Array of online users (excluding current user)
- `conversations`: Object keyed by conversation ID
  - `conversations.global`: Array of global messages
  - `conversations[userId]`: Array of private messages with user
- `typingUsers`: Object keyed by context ID showing who's typing
- `activeChat`: Current active conversation context

**Key Features**:
- `isUserViewingConversation(senderId)`: 
  - Return true if user is on Chat page AND viewing that specific conversation
  - Used to suppress notifications
- `showMessageNotification(msg, isPrivate)`: 
  - Toast notification untuk pesan baru
  - Skip jika sender adalah current user
  - Skip jika user sudah viewing conversation tersebut
- Auto-reconnect when user re-authenticates
- Cleanup on logout

#### 4. Multiple Accounts Per Tab - KEY INSIGHT

**Mechanism**:
- Setiap **tab/window** adalah **instance React app yang independen**
- Setiap instance punya **ChatContext sendiri** dengan **WebSocket sendiri**
- Saat login di Tab 1 dengan User A:
  - Tab 1's ChatContext → startChatStream() → WebSocket A terbentuk
- Saat login di Tab 2 dengan User B:
  - Tab 2's ChatContext → startChatStream() → WebSocket B terbentuk (INDEPENDENT)
- Server menerima 2 koneksi WebSocket terpisah dari user A dan B
- **localStorage/sessionStorage**: Token disimpan per tab (browser automatically isolates)

---

## Implementation Checklist

### Backend
- [ ] UserManager class dengan Map-based user tracking
- [ ] JWT verification dengan fallback untuk dev mode
- [ ] WebSocket server dengan connection handler
- [ ] Auth message handler dengan user registration
- [ ] Message handler (global & private)
- [ ] Typing indicator handler
- [ ] Presence broadcast saat connect/disconnect
- [ ] Error handling & graceful close
- [ ] Unique message ID generation

### Frontend
- [ ] Chat Service singleton dengan WebSocket state
- [ ] Auth flow dengan JWT token
- [ ] Auto-reconnect dengan exponential backoff
- [ ] Message handler routing
- [ ] Type casting (userId ke string) untuk consistency
- [ ] Connection validation (`if (ws !== socket) return`)
- [ ] Debounced connection attempts
- [ ] Chat Context untuk state management
- [ ] Conversation history per context
- [ ] Typing indicators
- [ ] Presence updates
- [ ] Toast notifications
- [ ] Active chat tracking

### Environment Setup
- [ ] `.env` file dengan JWT_SECRET dan WS_HOST
- [ ] CORS configuration untuk WebSocket
- [ ] Port configuration (default: 8080)
- [ ] Node packages: ws, express, jsonwebtoken

---

## Critical Implementation Details

### 1. Per-Tab Independence
```javascript
// SETIAP TAB PUNYA INSTANCE SENDIRI - PENTING!
// Tab1 -> ChatContext1 -> WebSocket1 (User A)
// Tab2 -> ChatContext2 -> WebSocket2 (User B)

// localStorage/sessionStorage automatically isolated per tab in modern browsers
// NO NEED untuk manual tab handling - browser handles it
```

### 2. Socket Replacement Logic
```javascript
// Saat user reconnect atau ada new connection attempt
// Tutup koneksi lama untuk prevent duplicate subscriptions
const existing = this.users.get(userId);
if (existing && existing.ws !== ws) {
  console.log(`User ${userName} reconnecting, closing old connection`);
  try {
    existing.ws.close(1000, 'Replaced by new connection');
  } catch (e) {
    // ignore
  }
}
```

### 3. Message Confirmation Pattern
```javascript
// Client mengirim message
chatService.sendMessage(text);

// Server memproses dan broadcast
// Server kirim confirmation back ke sender
{ type: 'message_sent', success: true, messageId }

// Client dapat confirm bahwa message dikirim
```

### 4. Echo-Back Pattern untuk Private Messages
```javascript
// Private message dikirm ke:
// 1. recipient (userManager.sendToUser(recipientId, ...))
// 2. sender echo-back (userManager.sendToSocket(ws, ...))

// Ini memastikan sender tau message-nya berhasil dikirim
```

### 5. Connection ID untuk Tracking
```javascript
// Generate unique connectionId saat create WebSocket
const connectionId = Date.now();

// Gunakan untuk logging dan prevent old socket handlers
if (ws !== socket) {
  console.log(`[${connectionId}] Socket replaced, ignoring event`);
  return;
}
```

### 6. Token Sending
```javascript
// Token dikirim di auth message, bukan di header/query string
// Lebih aman dan cleaner untuk WebSocket
{ type: 'auth', userId, userName, token }
```

---

## Testing Checklist

- [ ] Single user: Send message → Receive broadcast
- [ ] Multiple users: User A sends → All users receive
- [ ] Private message: User A → User B (only B receives)
- [ ] Private message echo: User A sends → A juga terima echo
- [ ] Typing indicator: Show "User X is typing..."
- [ ] Presence: User comes online → Broadcast presence
- [ ] Presence: User disconnect → Broadcast offline
- [ ] Multi-tab same account: Tab 1 & Tab 2 both logged in as A
  - Close Tab 1 → Tab 2 still connected
  - Tab 2 still can send messages
- [ ] Multi-tab different accounts: Tab 1 (User A) + Tab 2 (User B)
  - Tab 1 sends message → All receive (including Tab 2)
  - Tab 2 sends private to Tab 1 → Tab 1 receives
  - Close Tab 1 → Tab 2 still connected
- [ ] Reconnect: Disconnect network → Auto reconnect after 3s
- [ ] Reconnect backoff: Verify exponential backoff (3s, 6s, 12s, 24s, 30s max)
- [ ] Max reconnect: After 5 attempts → show error
- [ ] JWT invalid: Send auth with invalid token → Reject
- [ ] Auth required: Send message before auth → Reject with "Not authenticated"
- [ ] Notification suppression:
  - User viewing global chat → no toast for global messages
  - User viewing private with User B → no toast for User B messages
  - User NOT on chat page → toast for all messages
- [ ] User list: Receive list of other online users
- [ ] Message ID: Each message has unique ID (prevent duplicates)

---

## Security Considerations

1. **JWT Verification**: Always verify JWT signature dan expiry
2. **Token Refresh**: Implement token refresh mechanism (store in memory, not localStorage)
3. **Message Validation**: Validate message length, format, recipient exists
4. **Rate Limiting**: Add rate limit untuk message sending (prevent spam)
5. **XSS Protection**: Sanitize messages before display
6. **CORS Headers**: Configure CORS properly untuk WebSocket endpoint
7. **HTTPS/WSS**: Use WSS (WebSocket Secure) in production
8. **User Isolation**: Ensure user hanya bisa access own conversations

---

## Optional Enhancements

1. **Message Persistence**: Simpan messages ke database
2. **Read Receipts**: Tampilkan indicator "message read"
3. **Typing Timeout**: Auto-stop typing indicator after 3 seconds idle
4. **Presence Polling**: Periodic update user presence (untuk detect offline gracefully)
5. **Message Grouping**: Group messages by sender/timestamp
6. **Reaction/Emoji**: Add emoji reactions to messages
7. **File Sharing**: Support file upload via WebSocket
8. **End-to-End Encryption**: Encrypt messages di client-side
9. **Message Retraction**: Allow user to delete/edit messages
10. **Search**: Search chat history

---

## Dependencies

### Backend
```json
{
  "ws": "^8.18.3",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^17.2.3"
}
```

### Frontend
```json
{
  "react": "^18.x",
  "@chakra-ui/react": "^2.x"  // atau UI library pilihan
}
```

---

## File Structure

```
project/
├── chat-service/
│   ├── server/
│   │   └── websocket-server.js      # Main WebSocket server + UserManager
│   ├── package.json
│   ├── .env                         # JWT_SECRET, WS_HOST
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── chatService.js       # WebSocket singleton
│   │   │   ├── authService.js       # Token management
│   │   │   └── typingService.js     # Typing indicator logic
│   │   ├── context/
│   │   │   └── ChatContext.jsx      # React Context + Provider
│   │   ├── pages/
│   │   │   └── ChatPage.jsx         # Chat UI
│   │   ├── components/
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── UserList.jsx
│   │   │   └── TypingIndicator.jsx
│   │   └── index.js
│   └── .env                         # VITE_WS_HOST
└── backend/
    ├── .env                         # JWT_SECRET
    └── routes/
        └── api.php                  # API endpoints (untuk auth, etc)
```

---

## Notes & Tips

1. **Connection ID**: Gunakan timestamp untuk unique connection ID → membantu debugging
2. **Debouncing**: Debounce typing indicator sending (jangan setiap keystroke)
3. **Message Ordering**: WebSocket maintains order, tapi consider adding `timestamp` ke messages
4. **Offline Queue**: Consider queue-ing messages ketika offline (optional)
5. **Memory Leaks**: Always cleanup listeners saat component unmount
6. **Type Casting**: Always cast userId ke string untuk consistency (DB vs JS numbers)
7. **Error Logging**: Log semua WebSocket errors ke console/monitoring service
8. **Dev Tools**: Browser DevTools → Network tab → WS untuk debug WebSocket
9. **Testing Tools**: Use ws CLI atau Postman WebSocket client untuk test server
10. **Performance**: Monitor connection count dan message throughput

---

## Reference Implementation Locations

Refer ke existing implementation di: `frontend/src/services/chatService.js`, `frontend/src/context/ChatContext.jsx`, `chat-service/server/websocket-server.js`
