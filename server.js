const net = require('net');

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0';

const clients = new Map();

function broadcast(message, excludeSocket = null) {
    clients.forEach((username, socket) => {
        if (socket !== excludeSocket) {
            try {
                socket.write(message + '\n');
            } catch (err) {}
        }
    });
}

function handleClient(socket) {
    let username = null;

    socket.on('data', (data) => {
        const lines = data.toString().trim().split('\n');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            
            const parts = trimmedLine.split(/\s+/);
            const command = parts[0];
            
            if (command === 'LOGIN') {
                if (parts.length < 2) {
                    socket.write('ERR invalid-login\n');
                    return;
                }
                const requestedUsername = parts.slice(1).join(' ').trim();
                
                let usernameTaken = false;
                clients.forEach((user) => {
                    if (user === requestedUsername) {
                        usernameTaken = true;
                    }
                });
                
                if (usernameTaken) {
                    socket.write('ERR username-taken\n');
                } else {
                    username = requestedUsername;
                    clients.set(socket, username);
                    socket.write('OK\n');
                }
            }
            else if (command === 'MSG') {
                if (!username) {
                    socket.write('ERR not-logged-in\n');
                    return;
                }
                if (parts.length < 2) return;
                const messageText = parts.slice(1).join(' ').trim();
                broadcast(`MSG ${username} ${messageText}`);
            }
            else if (command === 'WHO') {
                if (!username) {
                    socket.write('ERR not-logged-in\n');
                    return;
                }
                clients.forEach((user) => {
                    socket.write(`USER ${user}\n`);
                });
            }
            else if (command === 'DM') {
                if (!username) {
                    socket.write('ERR not-logged-in\n');
                    return;
                }
                if (parts.length < 3) return;
                const targetUsername = parts[1].trim();
                const dmMessage = parts.slice(2).join(' ').trim();
                
                clients.forEach((user, sock) => {
                    if (user === targetUsername) {
                        try {
                            sock.write(`DM ${username} ${dmMessage}\n`);
                        } catch (err) {}
                    }
                });
            }
            else if (command === 'PING') {
                socket.write('PONG\n');
            }
        });
    });

    socket.on('end', () => {
        if (username) {
            clients.delete(socket);
            broadcast(`INFO ${username} disconnected`);
        }
    });

    socket.on('error', () => {
        if (username) {
            clients.delete(socket);
            broadcast(`INFO ${username} disconnected`);
        }
    });
}

const server = net.createServer(handleClient);

server.listen(PORT, HOST, () => {
    console.log(`Chat server listening on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
