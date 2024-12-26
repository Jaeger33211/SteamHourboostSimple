//Require all dependencys we need
import fs from "fs"; // => Importing the Filesystem module to access our config file
import steamUser from "steam-user"; // => Importing the node Steam-User package which handles our Sessions / Logins etc
//OPTIONAL
import color from "chalk"; // => Import chalk to use colors
var config = JSON.parse(fs.readFileSync("config.json")); // Using and parsing the config file

var client = new steamUser;
var username = config.username;
var password = config.password;
var errorCounter = 0;
var appids = config.appids;
async function doBoost(){

    client.logOn({
		accountName: username,
		password: password
	});

}



async function handleError(eresult){
errorCounter++;
if(eresult == "5"){
console.log(color.red("Error detected => Username or Password incorrect!"));
return;
}else{
   if(errorCounter > maxErrors){
    console.log(color.red("Error detected => Couldnt login after: "+maxErrors+ ".\nScript is exiting!"));
    process.exit(0);
   } 
    console.log(color.blue("Waiting 30 Minutes to see  if we can login once again...."));
    await new Promise(p => setTimeout(p, 1800000)); // waiting 30 minutes and after that try logging in again, increasing the errorcounter by 1 always
    doBoost();

}

}


doBoost();



//Handling Responses from node steam user
client.on('loggedOn', function(details) {
	console.log('Logged into Steam as ' + client.steamID.getSteam3RenderedID());
	client.setPersona(SteamUser.EPersonaState.Online);
	client.gamesPlayed(appids);
});

client.on('error', function(e) {
	// Some error occurred during logon
	handleError(e.eresult);
});
