import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TOKEN;

console.log('Starting script...');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    console.log('Message received');
    if (message.content === '!check') {
        console.log('Received !check command');
        message.channel.send('Checking rate limits...');

        const embed = new EmbedBuilder()
            .setTitle('Server Information')
            .setColor('#0099ff');
          //Change these to your IP's, you may remove and add more.
        const ipAddresses = [
            { name: '**Bravo .27**', ip: '45.84.59.27' },
            { name: '**Bravo .49**', ip: '45.84.59.49' },
            { name: '**Bravo .50**', ip: '45.84.59.50' },
            { name: '**Bravo .51 [DEDICATED]**', ip: '45.84.59.51' },
            { name: '**Bravo .48 [DEDICATED]**', ip: '45.84.59.48' },
            { name: '**Bravo .28 [DEDICATED]**', ip: '45.84.59.28' }
        ];

        const rateLimitChecks = ipAddresses.map(async machine => {
            const result = await checkRateLimit(machine.ip);
            return { name: machine.name, ip: machine.ip, ...result };
        });

        const results = await Promise.all(rateLimitChecks);

        results.forEach(result => {
            embed.addFields(
                { name: result.name, value: `IP: ${result.ip}\nRate Limited: ${result.isRateLimited ? '**True**' : '**False**'}` }
            );
        });

        console.log('Sending embed response');
        message.channel.send({ embeds: [embed] });
    }
});

async function checkRateLimit(ip) {
    console.log(`Checking rate limit for IP: ${ip}`);
    try {
        const response = await fetch(`https://discord.com/api/v10/users/@me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bot ${token}`,
                'X-Forwarded-For': ip
            }
        });

        const status = response.status;
        const message = await response.text();

        if (status === 429) {
            console.log(`IP ${ip} is rate limited. Status: ${status}, Message: ${message}`);
            return { isRateLimited: true, status, message };
        }

        console.log(`IP ${ip} is not rate limited. Status: ${status}, Message: ${message}`);
        return { isRateLimited: false, status, message };
    } catch (error) {
        console.error(`Error checking rate limit for IP ${ip}:`, error);
        return { isRateLimited: false, status: 'error', message: error.message };
    }
}

console.log('Attempting to log in...');
client.login(token).then(() => {
    console.log('Login successful');
}).catch(error => {
    console.error('Login failed:', error);
});
