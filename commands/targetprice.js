module.exports = {
    name: 'targetprice',
    description: 'set a target price for a coin and get notified',
    async execute(message, args){

        const fetch = require('node-fetch');
        let myInterval;
        
        
        
        if(args.length == 3){
            message.react('✅');

            message.author.send(`We will notify you when **${capitalize(args[0])}** price gets ${args[2]} **${comma(args[1])}$**!`);
            try {
                

                myInterval = setInterval(comparePrice,10000);

                
            } catch (error) {
               console.log(error); 
            }


        

        }else{
            message.channel.send('Please type the command in the correct format. e.g !targetprice bitcoin 30000 under');
            
        }

        async function comparePrice(){

                const coin_gkeko_api_url = `https://api.coingecko.com/api/v3/simple/price?ids=${args[0]}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_last_updated_at=true`;
        
                const response = await fetch(coin_gkeko_api_url);
        
                const data = await response.json();

                const price = parseFloat(data[args[0]].usd).toFixed(2);

            console.log("Target Price: " + args[1] + "\nCurrent Price: " + price);
            if(args[2] == 'over'){
                if(price>=args[1]){
                    message.author.send("⚠️" +capitalize(args[0]) + " price is over " + args[1] + "$ ⚠️");
                    
                    clearInterval(myInterval);
                }

            }else if(args[2] == 'under'){
                if(price<args[1]){
                    message.author.send("⚠️" + capitalize(args[0]) + " price is under " + args[1] + "$ ⚠️");
                    clearInterval(myInterval);
                }

            }else{
                message.channel.send('Something went wrong. Make sure target price is above current price if you choose over');
            }

        }
        

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
        function comma(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          }
    }

}


