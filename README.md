# TCP Chat Server

A simple TCP-based chat server that supports multiple concurrent users, built using only Node.js standard library.

## Requirements

- Node.js (v12 or higher)
- No external dependencies

## Running the Server

Default port (4000):
```bash
node server.js
```

Custom port using environment variable:
```bash
PORT=5000 node server.js
```

On Windows PowerShell:
```powershell
$env:PORT=5000; node server.js
```

## Connecting to the Server

Use the provided Node.js client:

```bash
node client.js
```

Or use `telnet` (may need to enable it on Windows):
```bash
telnet localhost 4000
```

## Commands

### Login
```
LOGIN <username>
```
Response: `OK` or `ERR username-taken`

### Send Message
```
MSG <text>
```
Broadcasts to all users as: `MSG <username> <text>`

### List Active Users
```
WHO
```
Response: `USER <username>` for each connected user

### Private Message
```
DM <username> <text>
```
Sends private message to specific user

### Heartbeat
```
PING
```
Response: `PONG`

## Example Interaction

### Terminal 1 (User: Naman)
```
$ node client.js
Connected to chat server
LOGIN Naman
OK
MSG hi everyone!
MSG how are you?
MSG Yudi hello Naman!
```

### Terminal 2 (User: Yudi)
```
$ node client.js
Connected to chat server
LOGIN Yudi
OK
MSG Naman hi everyone!
MSG Naman how are you?
MSG hello Naman!
```

### When Naman disconnects:
```
INFO Naman disconnected
```

## Features

- Multi-client support (handles 10+ concurrent connections)
- Username validation
- Real-time message broadcasting
- Disconnect notifications
- List active users (WHO command)
- Private messaging (DM command)
- Heartbeat (PING/PONG)

## Screen Recording

[Add your screen recording link here]

## Testing Locally

1. Start the server in one terminal:
   ```bash
   node server.js
   ```

2. Open multiple new terminal windows and connect using the client:
   ```bash
   node client.js
   ```

3. Login with different usernames in each terminal:
   ```
   LOGIN Alice
   LOGIN Bob
   ```

4. Send messages and test features:
   ```
   MSG Hello everyone!
   WHO
   DM Alice private message
   PING
   ```
