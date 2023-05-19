var CurrencySplitter = CurrencySplitter || (function() {
    'use strict';

    var version = '0.0.2';
    var lastUpdate = 20220208;
    var schemaVersion = 0.5;
    
    var defaultPartySize = 4;
    
    var checkInstall = function() {
        //sendChat("CurrencySplitter", "/w gm CurrencySplitter Ready");
    };
    
    const getAttr = function (charId, name) {
        return findObjs({
            type: 'attribute',
            characterid: charId,
            name: name
        }, {
            caseInsensitive: true
        })[0];
    };
  
    var handleInput = function(msg) {
        // Check that the message sent is for the api, if not return as we don't need to do anything.
        if (msg.type !== "api") {
            return;
        }
        
        var args = msg.content.split(/\s/);
        // Parse the first section of the arguments to get an array containing the commands.
        var commands = parseCommands(args.shift());
        // Parse the remaining aruments to get any parameters passed in.
        var params = parseParameters(args);
        
        switch (commands.shift().toLowerCase()) {
            case "!cs":
                splitCurrency(msg, params);
            break;
            default:
                // If we reached here it means that the call to the api was not meant for us.
                return;
        }
        
    };
    
    var splitCurrency = function(msg, params){
        var error = false;
        var platinum = 0;
        var gold = 0;
        var silver = 0;
        var copper = 0;
        if (params.hasOwnProperty("p")) {
            platinum = parseInt(params.p);
            if(isNaN(platinum)){
                error = true;
            }
        }
        if (params.hasOwnProperty("g")) {
            gold = parseInt(params.g);
            if(isNaN(gold)){
                error = true;
            }
        }
        if (params.hasOwnProperty("s")) {
            silver = parseInt(params.s);
            if(isNaN(silver)){
                error = true;
            }
        }
        if (params.hasOwnProperty("c")) {
            copper = parseInt(params.c);
            if(isNaN(copper)){
                error = true;
            }
        }
        if(error){
            help(msg);
            return;
        }
        
        var sumCopper = 0;
        sumCopper = sumCopper + platinum * 1000;
        sumCopper = sumCopper + gold * 100;
        sumCopper = sumCopper + silver * 10;
        sumCopper = sumCopper + copper;
        
        if(sumCopper == 0){
            help(msg);
            return;
        }
        
        var splittedCopper = 0;
        splittedCopper = sumCopper / defaultPartySize;
        splittedCopper = Math.ceil(splittedCopper);
        
        var handoutCopper = splittedCopper;
        var handoutPlatinum = Math.floor(handoutCopper / 1000);
        handoutCopper -= handoutPlatinum * 1000;
        
        var handoutGold = Math.floor(handoutCopper / 100);
        handoutCopper -= handoutGold * 100;
        
        var handoutSilver = Math.floor(handoutCopper / 10);
        handoutCopper -= handoutSilver * 10;
        
        var text;
        var text = "";
        text += "<div style='border: 1px solid black;border-radius:5px;padding:5px;'>";
        text += "<span style='font-weight:bold;'>Every Party Member receives:</span><br><br>";
        text += "<table>";
        if(handoutPlatinum > 0){
            text += "<tr>";
            text += "<td style='border:none; text-decoration:underline; font-style:italic;'>Platinum:</span></td>";
            text += "<td style='border:none; padding-left:5px;'>"+handoutPlatinum+"</td>";
            text += "</tr>";
        }
        if(handoutGold > 0){
            text += "<tr>";
            text += "<td style='border:none; text-decoration:underline; font-style:italic;'>Gold:</span></td>";
            text += "<td style='border:none; padding-left:5px;'>"+handoutGold+"</td>";
            text += "</tr>";
        }
        if(handoutSilver > 0){
            text += "<tr>";
            text += "<td style='border:none; text-decoration:underline; font-style:italic;'>Silver:</span></td>";
            text += "<td style='border:none; padding-left:5px;'>"+handoutSilver+"</td>";
            text += "</tr>";
        }
        if(handoutCopper > 0){
            text += "<tr>";
            text += "<td style='border:none; text-decoration:underline; font-style:italic;'>Copper:</span></td>";
            text += "<td style='border:none; padding-left:5px;'>"+handoutCopper+"</td>";
            text += "</tr>";
        }
        text += "</table>";
        text += "</div>";
        
        chat("", "", text);
        
    };
    
    var help = function(msg) {
        var text = "";
        text += "<div style='border: 1px solid black;border-radius:5px;padding:5px;'>";
        text += "<span style='font-weight:bold;'>Message must contain at least one parameter with a number!</span><br><br>";
        text += "<span style='font-weight:bold;'>Possible parameters are:</span><br>";
        text += "<table>";
        text += "<tr>";
        text += "<td style='border:none; text-decoration:underline; font-style:italic;'>Platinum:</span></td>";
        text += "<td style='border:none; padding-left:5px;'>!cs -p 5</td>";
        text += "</tr>";
        text += "<tr>";
        text += "<td style='border:none; text-decoration:underline; font-style:italic;'>Gold:</span></td>";
        text += "<td style='border:none; padding-left:5px;'>!cs -g 3</td>";
        text += "</tr>";
        text += "<tr>";
        text += "<td style='border:none; text-decoration:underline; font-style:italic;'>Silver:</span></td>";
        text += "<td style='border:none; padding-left:5px;'>!cs -s 7</td>";
        text += "</tr>";
        text += "<tr>";
        text += "<td style='border:none; text-decoration:underline; font-style:italic;'>Copper:</span></td>";
        text += "<td style='border:none; padding-left:5px;'>!cs -c 12</td>";
        text += "</tr>";
        text += "</table>";
        text += "</div>";
        chat("/w", msg.who, text);
    };
    
    var chat = function(type, who, message) {
        who = who.split(" ")[0].replace(" (GM)", "");
        sendChat("Currency Splitter", type + " " + who + " " + message, {noarchive:true});
    };
    
    // Parses the commands of the call to the api script.
    var parseCommands = function(args) {
        if (args === undefined) {
            // If it is then return an empty array.
            return [];
        }
        // Split the arguments by spaces and return the array containing them all.
        return args.split(/\s+/);
    };
    
    // Parses the parameters of the call to the api script.
    var parseParameters = function(args) {
        // Check if args is undefined.
        if (args === undefined) {
            // If it is then return an empty object.
            return {};
        }
        // Declare a new object to hold the parameters.
        var params = {};
        // Loop through all the passed in arguments and construct them in into the parameters.
        for (var param in args) {
            if (args.hasOwnProperty(param)) {
                // Split the parameter down by spaces and temporarily store it.
                var amount = args[param].match(/[0-9]*/);
                var currency = args[param].match(/[pgsc]/);
                // Take the first element in tmp and use it as the parameter name and reassemble the
                // remaining elements and replace the commas with spaces for the parameter value.
                params[currency] = amount;
            }
        }
        // Return the constructed object of parameters.
        return params;
    };
    
    var registerEventHandlers = function() {
        on('chat:message', handleInput);
        //on('add:graphic', setTokenAttributes);
        //on('change:graphic', setTokenAttributes);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };
}());

on("ready",function(){
    'use strict';
    CurrencySplitter.CheckInstall(); 
    CurrencySplitter.RegisterEventHandlers();
});