const net = require('net');
const readline = require('readline');

const PORT = process.env.PORT || 4000;
const HOST = process.argv[2] || 'localhost';

const client = net.createConnection({ port: PORT, host: HOST }, () => {
    console.log('Connected to chat server');
    console.log('Commands: LOGIN <username>, MSG <text>, WHO, DM <username> <text>, PING');
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
});

client.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
        if (line.trim()) {
            console.log(line.trim());
        }
    });
});

client.on('end', () => {
    console.log('Disconnected from server');
    process.exit(0);
});

client.on('error', (err) => {
    console.error('Connection error:', err.message);
    process.exit(1);
});

rl.on('line', (line) => {
    if (line.trim()) {
        client.write(line.trim() + '\n');
    }
});

rl.on('close', () => {
    client.end();
});
