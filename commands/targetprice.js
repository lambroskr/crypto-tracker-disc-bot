module.exports = {
    name: 'targetprice',
    description: 'set a target price for a coin and get notified',
    async execute(message, args){

        const fetch = require('node-fetch');
        let myInterval;
        const coin_gkeko_api_url = `https://api.coingecko.com/api/v3/simple/price?ids=${args[0]}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_last_updated_at=true`;

        
        

        
        
        if(args.length == 3){
           
            try {
        
                const response = await fetch(coin_gkeko_api_url);
            
                const data = await response.json();
    
                const price = parseFloat(data[args[0]].usd).toFixed(2);
    
                
                let targetprice = parseFloat(args[1]);
                
                if((args[2] == 'over' && targetprice > price) || (args[2] == 'under' && targetprice < price )){
                    message.react('✅');
                    message.reply('Succesful request! We will send you a private message to notify you.');
                    message.author.send(`We will notify you when **${capitalize(args[0])}** price gets ${args[2]} **${comma(args[1])}$**!`);
                    myInterval = setInterval(comparePrice,10000);
                    console.log('Succesful request by' + message.author.tag);
                }else{
                    message.channel.send("Make sure target price isn't already higher/lower than current price");
                    message.react('❌');
                    console.log("Current price: " + price + "\nTarget price: " + targetprice);
                }
                
            } catch (error) {
               console.log(error);
               clearInterval(myInterval);
               message.react('❌');

            }


        

        }else{
            message.channel.send('Please type the command in the correct format. e.g !targetprice bitcoin 30000 under');
            message.react('❌');
        }

        async function comparePrice(){

            const response = await fetch(coin_gkeko_api_url);
        
            const data = await response.json();

            const price = parseFloat(data[args[0]].usd).toFixed(2);
            

            
            if(args[2] == 'over'){

                
                if(price>=args[1]){
                    message.author.send("⚠️**" +capitalize(args[0]) + "** price is **over " + args[1] + "$** ⚠️");
                    clearInterval(myInterval);
                }

            }else if(args[2] == 'under'){
                if(price<args[1]){
                    message.author.send("⚠️**" + capitalize(args[0]) + "** price is **under " + args[1] + "$** ⚠️");
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


