const { Client } = require('rustrcon')
const dotenv = require('dotenv').config()
const rcon = new Client({
    ip: '91.189.176.196',
    port: 28216,
    password: process.env.RCON_PASSWORD
})
rcon.login()
rcon.on('connected', (user, req, res) => {
	console.log(`Connected to ${rcon.ws.ip}:${rcon.ws.port}`);

	// Message, Name, Identifier.
	rcon.send('status', 'Artful', 11);
    rcon.send("players")

	setTimeout(() => {
		rcon.destroy();
	}, 1000);
});

rcon.on('error', err => {
	console.error(err);
});

rcon.on('disconnect', () => {
	console.log('Disconnected from RCON websocket');
});

rcon.on('message', message => {
	console.log(message);
});
module.exports = rcon;