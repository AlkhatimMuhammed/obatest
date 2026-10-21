const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function startTest() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Chrome (Linux)", "", ""]
    });

    if (!sock.authState.creds.registered) {
        let phoneNumber = await askQuestion('Please enter your phone number with country code (e.g., 2499XXXXXXXX): ');
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

        setTimeout(async () => {
            try {
                let pairingCode = await sock.requestPairingCode(phoneNumber);
                console.log(`\n========================================`);
                console.log(`🔑 Your WhatsApp Pairing Code is: [ ${pairingCode} ]`);
                console.log(`========================================\n`);
                console.log('Go to WhatsApp > Linked Devices > Link a Device > Link with phone number instead.');
            } catch (err) {
                console.error("Error requesting pairing code:", err);
            }
        }, 4000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log('[-] Connection closed, attempting to reconnect...', shouldReconnect);
            if (shouldReconnect) startTest();
        } else if (connection === 'open') {
            console.log('[+] Connection established successfully! 🚀');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startTest();
