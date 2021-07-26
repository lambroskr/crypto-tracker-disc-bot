module.exports = {
    name: 'price',
    description: 'get price of a crypto coin',
    async execute(message, args){

        const fetch = require('node-fetch');
        const Discord = require('discord.js');
        require('dotenv').config();

        try {
            const coingkeko_api_url = `https://api.coingecko.com/api/v3/simple/price?ids=${args[0]}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_last_updated_at=true`;
            

            const response = await fetch(coingkeko_api_url);
        
            const data = await response.json();

            const price = comma(parseFloat(data[args[0]].usd));
            const changePercentage = parseFloat(data[args[0]].usd_24h_change).toFixed(2);
            const market_cap = comma(parseInt(data[args[0]].usd_market_cap));

            const img_response = await fetch(`https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=${args[0]}%20logo&pageNumber=1&pageSize=10&autoCorrect=true`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": process.env.RAPIDTOKEN,
                    "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com"
                }
            });

            const img_data = await img_response.json();


            const img_url = img_data.value[2].url;





            const coinEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(capitalize(args[0]))
                .setURL(`https://www.coingecko.com/en/coins/${args[0]}`)
                .addFields(
                    { name: 'Current Price:', value: `${price}$` },
                    
                    { name: '24h Change Percentage', value: `${changePercentage}%` },
                    { name: 'Market Cap', value: `${market_cap}$` },
                )
                .setThumbnail(img_url)
                .setFooter('Powered by CoinGecko', 'https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png')
                .setTimestamp();
            message.channel.send(coinEmbed);
            
            
        } catch (error) { 
            message.channel.send('Please type a valid crypto name. e.g !price bitcoin');
            console.log(error);
        }
        
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
        function comma(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          }

    }
    
}