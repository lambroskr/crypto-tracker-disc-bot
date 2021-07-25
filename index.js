const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const coingkeko_api_url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_last_updated_at=true';


const prefix = '!';

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}



require('dotenv').config();

client.login(process.env.BOTTOKEN);


async function getData(){
    const response = await fetch(coingkeko_api_url);

        const data = await response.json();

        console.log("From Simple Price: BTC: " + data.bitcoin.usd)
        client.user.setActivity(`BTC: ${comma(data.bitcoin.usd)}$`, { type: 'WATCHING' });
        return data.bitcoin.usd;
}

setInterval(getData,20000);


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
        
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if(command === 'price'){
        client.commands.get('price').execute(message,args);
    } 

});

function comma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }




