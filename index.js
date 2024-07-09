const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv');
const colors = require('colors')
dotenv.config();
colors.enable()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const ipList = [
    '45.84.59.27',
    '45.84.59.49',
    '45.84.59.50',
    '45.84.59.51',
    '45.84.59.48',
    '45.84.59.28',
    '45.137.205.185',
];

client.once('ready', () => {
    console.log(colors.blue('-- Discord Rate Limit Checker --'))
    console.log(colors.yellow('This was created by @superevilluke and all credit must be given to him for creating this.'))
    console.log(colors.green('The Discord bot has successfully connected to Discord API'))
});

client.on('messageCreate', async message => {
    if (message.content === '!check') {
        let results = [];
        const totalIPs = ipList.length;
        let progressMessage = await message.channel.send(`Checking IP 1/${totalIPs}`);

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        const checkRateLimit = async (ip) => {
            try {
                const response = await axios.get('https://discordapp.com/api/v9/gateway/bot', {
                    headers: {
                        'X-Forwarded-For': ip,
                        'Authorization': `Bot ${process.env.TOKEN}`
                    }
                });

                const remaining = response.headers['x-ratelimit-remaining'];
                const reset = response.headers['x-ratelimit-reset'];

                console.log(`IP: ${ip}, Remaining: ${remaining}, Reset: ${reset}`);

                if (remaining === '0') {
                    return { ip, rateLimited: true, reset: new Date(reset * 1000).toLocaleString() };
                } else {
                    return { ip, rateLimited: false };
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 429) {
                        const retryAfter = error.response.headers['retry-after'];
                        console.log(`IP: ${ip}, Rate limited: true, Retry-After: ${retryAfter}`);
                        return { ip, rateLimited: true, retryAfter: retryAfter ? `${retryAfter} seconds` : 'Unknown' };
                    } else {
                        console.log(`IP: ${ip}, Error: ${error.response.status} ${error.response.statusText}`);
                        return { ip, rateLimited: `Error: ${error.response.status} ${error.response.statusText}` };
                    }
                } else if (error.request) {
                    console.log(`IP: ${ip}, No response received from Discord API`);
                    return { ip, rateLimited: 'No response received from Discord API' };
                } else {
                    console.log(`IP: ${ip}, Request error: ${error.message}`);
                    return { ip, rateLimited: `Request error: ${error.message}` };
                }
            }
        };

        for (let i = 0; i < ipList.length; i++) {
            const result = await checkRateLimit(ipList[i]);
            results.push(result);

            await progressMessage.edit(`Checking IP ${i + 1}/${totalIPs}`);

            await delay(5000);
        }

        const embed = new EmbedBuilder()
            .setTitle('IP Rate Limit Check')
            .setColor(0x0099ff)
            .setDescription('Results of rate limit check on the given IPs:')
            .setTimestamp();

        results.forEach(result => {
            embed.addFields({ 
                name: `IP: ${result.ip}`, 
                value: `Rate Limited: ${result.rateLimited} ${result.reset ? `(Reset at: ${result.reset})` : ''} ${result.retryAfter ? `(Retry after: ${result.retryAfter})` : ''}`, 
                inline: false 
            });
        });

        message.channel.send({ embeds: [embed] });
        await progressMessage.delete();
    }
});

client.login(process.env.TOKEN);
