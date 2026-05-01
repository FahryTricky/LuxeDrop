# WebSocket Architecture & Flow Diagrams

## 1. Connection Lifecycle - Single User

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Tab 1 - User A)              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ React App                                               │    │
│  │ ├── ChatContext (useContext)                            │    │
│  │ ├── chatService (singleton)                             │    │
│  │ └── ws = null                                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                         (Step 1)                                │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ User clicks "Chat" → ChatContext useEffect triggers    │    │
│  │ ├── Check: isAuthenticated() → true ✓                  │    │
│  │ ├── Check: connectionRef.current → null ✓              │    │
│  │ └── Call: chatService.startChatStream(handlers)        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                         (Step 2)                                │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ chatService.startChatStream()                           │    │
│  │ ├── Get user from getAuthUser()                         │    │
│  │ ├── Get token from getAuthToken()                       │    │
│  │ ├── Create: ws = new WebSocket('ws://localhost:8080')  │    │
│  │ └── Set ws.connectionId = Date.now()                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                         (Step 3)                                │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ws.onopen event                                         │    │
│  │ ├── Check: if (ws !== socket) return  [prevent old]    │    │
│  │ ├── Reset: reconnectAttempts = 0                        │    │
│  │ └── Send: { type: 'auth', userId, userName, token }    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                         (HTTP upgrade)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Server)                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ wss.on('connection', (ws, request) => {                │    │
│  │   let isAuthenticated = false;                         │    │
│  │ });                                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                         (Step 4)                                │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ws.on('message', (data) => {                            │    │
│  │   parsed = JSON.parse(data)                             │    │
│  │   if (parsed.type === 'auth') {                         │    │
│  │     // JWT verification (if enabled)                    │    │
│  │     jwt.verify(token, JWT_SECRET) → OK ✓               │    │
│  │                                                         │    │
│  │     user = userManager.addUser(ws, userId, userName)   │    │
│  │     isAuthenticated = true                              │    │
│  │   }                                                      │    │
│  │ });                                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│           ┌──────────────────┼──────────────────┐               │
│           │                                     │               │
│       (Step 5a)                           (Step 5b)            │
│           │                                     │               │
│           ▼                                     ▼               │
│  ┌─────────────────────────────┐    ┌────────────────────┐    │
│  │ Send auth_success:          │    │ Broadcast presence │    │
│  │ {                           │    │ {                  │    │
│  │   type: 'auth_success',     │    │   type: 'presence',│    │
│  │   users: [...other users]   │    │   user: {A},       │    │
│  │ }                           │    │   isOnline: true   │    │
│  │                             │    │ }                  │    │
│  │ To: User A only             │    │ To: ALL other users│    │
│  └─────────────────────────────┘    └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                  ┌───────────┴───────────┐
                  │                       │
                (Step 6)            (Step 6)
                  │                       │
                  ▼                       ▼
          USER A connected        OTHERS notified:
          ├── Can send messages   "User A online"
          ├── Can see user list   
          └── Can receive messages
```

---

## 2. Multi-Tab Support: Different Accounts Same Browser

```
BROWSER CHROME WINDOW
══════════════════════════════════════════════════════════════════

┌─ TAB 1 ──────────────────────────────────┬─ TAB 2 ──────────────────────────────┐
│ URL: localhost:5173                      │ URL: localhost:5173                  │
│                                          │                                      │
│ ┌──────────────────────────────────────┐ │ ┌──────────────────────────────────┐ │
│ │ INDEPENDENT React App Instance 1     │ │ │ INDEPENDENT React App Instance 2 │ │
│ │                                      │ │ │                                  │ │
│ │ ┌──────────────────────────────────┐ │ │ ┌──────────────────────────────────┐ │
│ │ │ ChatContext 1                    │ │ │ │ ChatContext 2                    │ │
│ │ ├── isConnected: false → true      │ │ │ ├── isConnected: false → true    │ │
│ │ ├── users: []                      │ │ │ ├── users: []                    │ │
│ │ ├── conversations: {}              │ │ │ ├── conversations: {}            │ │
│ │ └── chatService (singleton 1)      │ │ │ └── chatService (singleton 2)    │ │
│ │                                    │ │ │                                  │ │
│ │     ws1 = null                     │ │ │     ws2 = null                   │ │
│ │                                    │ │ │                                  │ │
│ └──────────────────────────────────┘ │ │ └──────────────────────────────────┘ │
│          │                             │          │                           │
│      (A) Login with                    │      (B) Login with                  │
│      User A                            │      User B                          │
│          │                             │          │                           │
│          ▼                             │          ▼                           │
│  startChatStream()                     │  startChatStream()                   │
│    ├── user = {id: 'A', ...}           │    ├── user = {id: 'B', ...}        │
│    ├── token = 'jwt_token_A'           │    ├── token = 'jwt_token_B'        │
│    ├── ws1 = new WebSocket(...)        │    ├── ws2 = new WebSocket(...)     │
│    └── send auth                       │    └── send auth                     │
│                                        │                                      │
│    WS1 (CONNECTION A)                  │    WS2 (CONNECTION B)                │
│    └── Auth: {userId: 'A', token: X}   │    └── Auth: {userId: 'B', token: Y} │
│                                        │                                      │
└────────────────────────────────────────┴──────────────────────────────────────┘
                    │                                    │
                    │                                    │
                (HTTP Upgrade)                    (HTTP Upgrade)
                    │                                    │
                    ▼                                    ▼
════════════════════════════════════════════════════════════════════

BACKEND SERVER: WebSocket Server
════════════════════════════════════════════════════════════════════

wss (WebSocketServer)
├── connection event 1: ws1 arrives
│   └── UserManager.addUser(ws1, 'A', 'User A')
│       └── users.set('A', {ws: ws1, user: {...}})
│
├── connection event 2: ws2 arrives  [SEPARATE CONNECTION]
│   └── UserManager.addUser(ws2, 'B', 'User B')
│       └── users.set('B', {ws: ws2, user: {...}})
│
└── UserManager.users = {
    'A': {ws: ws1, user: {id: 'A', name: 'User A', ...}},
    'B': {ws: ws2, user: {id: 'B', name: 'User B', ...}}
}

════════════════════════════════════════════════════════════════════

RESULT:
┌─ TAB 1 (User A) ─────┬─ TAB 2 (User B) ──────┐
│ users: [B]           │ users: [A]            │
│ ✓ Can see User B     │ ✓ Can see User A      │
│ ✓ Can send messages  │ ✓ Can send messages   │
│ ✓ Can chat with B    │ ✓ Can chat with A     │
│                      │                       │
│ ws1 CONNECTED        │ ws2 CONNECTED         │
│ (independent)        │ (independent)         │
└──────────────────────┴───────────────────────┘

CLOSING TAB 1:
├── ws1.close()
├── UserManager.removeUser(ws1)
│   └── users.delete('A')
├── Broadcast presence (User A offline) to others
│
└── TAB 2 (User B) continues working! ✓
    └── ws2 STILL CONNECTED
```

---

## 3. Message Flow: Global vs Private

```
┌─────────────────────────────────────────────────────────────────┐
│                      GLOBAL MESSAGE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

User A in Tab 1          User B in Tab 2          User C in Tab 3
     │                        │                        │
     │ Types: "Hello all!"    │                        │
     │ Clicks Send            │                        │
     │                        │                        │
     ▼                        │                        │
  chatService.sendMessage    │                        │
     │                        │                        │
     │ {                      │                        │
     │   type: 'message',     │                        │
     │   text: 'Hello all!',  │                        │
     │   recipientId: null    │                        │
     │ }                      │                        │
     │                        │                        │
     └─────────────────────────────────────────────────┤
                              │                        │
                    [BACKEND: Server receives]          │
                              │                        │
           ┌──────────────────┼──────────────────┐     │
           │                  │                  │     │
           ▼                  ▼                  ▼     │
       Validate         Verify sender         Generate
       message          authenticated         messageId
           │                  │                  │
           └──────────────────┼──────────────────┘
                              │
                    Broadcast to ALL:
                    {
                      type: 'global_message',
                      id: '1234567-abc',
                      sender: {id: 'A', name: 'User A'},
                      text: 'Hello all!',
                      timestamp: 1234567890
                    }
                    │
           ┌────────┼────────┐
           │        │        │
           ▼        ▼        ▼
        → A ──────→ B ──────→ C
                   │        │
                   ▼        ▼
        Tab 1   Tab 2    Tab 3
      (sender)  receives receives
                message  message


┌─────────────────────────────────────────────────────────────────┐
│                    PRIVATE MESSAGE FLOW                         │
└─────────────────────────────────────────────────────────────────┘

User A in Tab 1          User B in Tab 2
     │                        │
     │ Types: "Hi B!"         │
     │ Selects User B         │
     │ Clicks Send            │
     │                        │
     ▼                        │
  chatService.sendMessage    │
  (with recipientId: 'B')    │
     │                        │
     │ {                      │
     │   type: 'message',     │
     │   text: 'Hi B!',       │
     │   recipientId: 'B'     │
     │ }                      │
     │                        │
     └────────────────────────┤
                              │
                    [BACKEND: Server receives]
                              │
           ┌──────────────────┼───────────────┐
           │                  │               │
           ▼                  ▼               ▼
       Validate         Verify recipient   Generate
       message          exists & online    messageId
           │                  │               │
           └──────────────────┼───────────────┘
                              │
                   Private Message created:
                   {
                     type: 'private_message',
                     id: '1234567-def',
                     sender: {id: 'A', name: 'User A'},
                     recipient: {id: 'B', name: 'User B'},
                     text: 'Hi B!',
                     timestamp: 1234567890
                   }
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
    sendToUser('B',    sendToSocket(ws_A,
     message)          message)     [echo back]
          │                 │
          ▼                 ▼
       Tab 2            Tab 1
      (recipient)      (sender)
      receives         receives
      message          CONFIRMATION

RESULT:
- User B sees: "User A: Hi B!"
- User A sees: "Me: Hi B!" (echo + confirmation)
- Other users see NOTHING (not broadcast)
```

---

## 4. Auto-Reconnect Flow

```
                    WebSocket Connection Active
                              │
                              │
                              ▼
                    [Network interruption]
                    [Browser refresh]
                    [Server restart]
                              │
                              ▼
                    ws.onclose event
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
      (A)                  (B)                  (C)
   Check:             Check:                Check:
isIntentional      event.code           reconnectAttempts
    Close?                │
         │                │                     │
      NO │             1000?                   │
         │             1001?                   │
      │  │              YES                    │
      │  │                │                    │
      │  │                └──→ DON'T reconnect <─  0-5?
      │  │                                          YES
      │  └─────────────────────────────────────────┤
      │                                            │
      └─────────────────────────────────────────────┤
                                                   │
                                                   ▼
                                        reconnectAttempts++
                                                   │
                              ┌────────────────────┘
                              │
                              ▼
                        Calculate delay:
                   delay = 3000 * 2^(attempts-1)
                              │
                   Attempt 1: 3s
                   Attempt 2: 6s
                   Attempt 3: 12s
                   Attempt 4: 24s
                   Attempt 5: 30s (MAX)
                              │
                              ▼
                    setTimeout(() => {
                      if (ws === null) {
                        chatService.startChatStream(handlers)
                      }
                    }, delay)
                              │
                        (wait for delay)
                              │
                              ▼
                    startChatStream() again
                              │
                         ┌────┴─────────────────┐
                         │                      │
                         ▼                      ▼
                   Success ✓             Max attempts ✗
                         │                      │
                         ▼                      ▼
            Reset          Reconnected      Show error:
            reconnectAttempts               "Failed to reconnect
            Send auth                        after 5 attempts"
            Resume chat
```

---

## 5. Key Data Structures

```
BACKEND - UserManager

┌─ users Map ────────────────────────────────────────────────────────┐
│                                                                    │
│  Key: userId (string)                                             │
│  Value: { ws: WebSocket, user: {...} }                            │
│                                                                    │
│  'A' → {                                                           │
│    ws: WebSocket(ws1),                                            │
│    user: {                                                         │
│      id: 'A',                                                     │
│      name: 'User A',                                              │
│      isOnline: true                                               │
│    }                                                               │
│  }                                                                 │
│                                                                    │
│  'B' → {                                                           │
│    ws: WebSocket(ws2),                                            │
│    user: {                                                         │
│      id: 'B',                                                     │
│      name: 'User B',                                              │
│      isOnline: true                                               │
│    }                                                               │
│  }                                                                 │
│                                                                    │
│  'C' → {                                                           │
│    ws: WebSocket(ws3),                                            │
│    user: {                                                         │
│      id: 'C',                                                     │
│      name: 'User C',                                              │
│      isOnline: true                                               │
│    }                                                               │
│  }                                                                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌─ socketToUser Map ──────────────────────────────────────────────────┐
│                                                                    │
│  Key: WebSocket instance                                          │
│  Value: userId (string)                                           │
│                                                                    │
│  WebSocket(ws1) → 'A'                                             │
│  WebSocket(ws2) → 'B'                                             │
│  WebSocket(ws3) → 'C'                                             │
│                                                                    │
│  [For fast lookup when socket disconnect]                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘


FRONTEND - ChatContext State

┌─ conversations Object ──────────────────────────────────────────────┐
│                                                                    │
│  Key: 'global' OR userId (string)                                 │
│  Value: Array of Message objects                                  │
│                                                                    │
│  {                                                                 │
│    global: [                                                      │
│      {                                                             │
│        id: '1234567-abc',                                         │
│        text: 'Hello all!',                                        │
│        sender: {id: 'A', name: 'User A'},                         │
│        timestamp: 1234567890,                                     │
│        type: 'received' || 'sent'                                 │
│      },                                                            │
│      ...                                                           │
│    ],                                                              │
│                                                                    │
│    'B': [  // Private with User B                                 │
│      {                                                             │
│        id: '1234567-def',                                         │
│        text: 'Hi B!',                                             │
│        sender: {id: 'A', name: 'User A'},                         │
│        timestamp: 1234567891,                                     │
│        type: 'sent'  // sender is current user                    │
│      },                                                            │
│      {                                                             │
│        id: '1234567-ghi',                                         │
│        text: 'Hey A!',                                            │
│        sender: {id: 'B', name: 'User B'},                         │
│        timestamp: 1234567892,                                     │
│        type: 'received'  // sender is other user                  │
│      },                                                            │
│      ...                                                           │
│    ]                                                               │
│  }                                                                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌─ typingUsers Object ────────────────────────────────────────────────┐
│                                                                    │
│  Key: contextId (string - usually same as conversationId)         │
│  Value: { userId: string, isTyping: boolean, timestamp }          │
│                                                                    │
│  {                                                                 │
│    'B': {                                                          │
│      userId: 'B',                                                 │
│      isTyping: true,                                              │
│      timestamp: 1234567900                                        │
│    }                                                               │
│  }                                                                 │
│                                                                    │
│  [Auto-clear after 3 seconds idle]                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌─ activeChat Object ─────────────────────────────────────────────────┐
│                                                                    │
│  Stores which conversation user is currently viewing              │
│                                                                    │
│  Global Chat:                                                      │
│  { type: 'global' }                                               │
│                                                                    │
│  Private Chat with User B:                                        │
│  { type: 'private', user: {id: 'B', name: 'User B'} }            │
│                                                                    │
│  [Used to suppress notifications]                                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 6. Message Type Reference

```
┌──────────────────────────────────────────────────────────────────┐
│                  CLIENT → SERVER MESSAGES                        │
└──────────────────────────────────────────────────────────────────┘

1. AUTH (First message - REQUIRED)
   {
     type: 'auth',
     userId: string (cast to string),
     userName: string,
     token: string (JWT token)
   }
   → Server: Verify JWT → Register user → Send auth_success

2. MESSAGE (Send text)
   {
     type: 'message',
     text: string (required, trimmed),
     recipientId?: string (optional - if private),
     id?: string (optional - auto-generated if missing)
   }
   → Server: Broadcast (global) or Forward (private) + echo

3. TYPING (Typing indicator)
   {
     type: 'typing',
     contextId: string (usually recipientId or 'global'),
     isTyping: boolean
   }
   → Server: Broadcast typing indicator

4. GET_USERS (Request user list)
   {
     type: 'get_users'
   }
   → Server: Send user_list with all online users


┌──────────────────────────────────────────────────────────────────┐
│                  SERVER → CLIENT MESSAGES                        │
└──────────────────────────────────────────────────────────────────┘

1. AUTH_SUCCESS (Auth confirmed)
   {
     type: 'auth_success',
     users: User[]  // List of other online users
   }
   → Client: Set authenticated, show user list

2. GLOBAL_MESSAGE (Broadcast message)
   {
     type: 'global_message',
     id: string,
     sender: User {id, name, isOnline},
     text: string,
     timestamp: number
   }
   → Client: Add to conversations.global, show toast if not viewing

3. PRIVATE_MESSAGE (Direct message)
   {
     type: 'private_message',
     id: string,
     sender: User,
     recipient: User,
     text: string,
     timestamp: number
   }
   → Client: Add to conversations[senderId], show toast if not viewing

4. PRESENCE (User online/offline)
   {
     type: 'presence',
     user: User,
     isOnline: boolean,
     timestamp: number
   }
   → Client: Update users list, show notification

5. TYPING (Typing indicator)
   {
     type: 'typing',
     user: User,
     contextId: string,
     isTyping: boolean,
     timestamp: number
   }
   → Client: Update typingUsers, show "User X is typing..."

6. USER_LIST (All online users)
   {
     type: 'user_list',
     users: User[]
   }
   → Client: Update users list

7. MESSAGE_SENT (Confirmation)
   {
     type: 'message_sent',
     success: boolean,
     messageId: string
   }
   → Client: Mark message as sent (optional)

8. ERROR (Error notification)
   {
     type: 'error',
     message: string
   }
   → Client: Show error, handle gracefully
```

---

## 7. WebSocket State Machine

```
                        START
                          │
                          ▼
                  ┌─ NOT CONNECTED
                  │
        Connect  │
            ↓    │
    ┌──────────────────────┐
    │  CONNECTING          │
    │  (ws.readyState = 0) │
    └──────────────────────┘
              │
         ┌────┴────┐
         │         │
    Success    Fail
         │         │
         ▼         ▼
      OPEN      ERROR
      │         │
      │    [Exponential backoff]
      │         │
      │         └→ Check max attempts
      │            ├─ < 5 attempts: reconnect
      │            └─ >= 5 attempts: stop
      │
      ├─ Server sends data
      │  └→ ws.onmessage
      │
      ├─ Error occurs
      │  └→ ws.onerror
      │
      ├─ Manual close
      │  └→ ws.close()
      │
      └─ Unexpected close
         └→ ws.onclose
            │
            ├─ Intentional (code 1000)
            │  └→ CLOSED [Don't reconnect]
            │
            └─ Unintentional
               └→ RECONNECTING
                  └→ CONNECTING
```

---

Diagrams ini menunjukkan bagaimana setiap komponen bekerja dan berkomunikasi!
