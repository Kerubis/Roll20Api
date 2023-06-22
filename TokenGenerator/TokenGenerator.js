var TokenGenerator = TokenGenerator || (function() {
    'use strict';

    var version = '0.0.1';
    var lastUpdate = 1616493496;
    var schemaVersion = 0.5;
    
    //one bar must be defined as hp/npc_hpformula
    var bar1 = '';
    var bar2 = 'npc_ac';
    var bar3 = 'npc_hpformula'; 
    var showbar1 = false;
    var showbar2 = false;
    var showbar3 = true;
    var compactbars = `compact`;

    var checkInstall = function() {    
        //sendChat("TokenGenerator", "/w gm KerubisTest Ready");
    };
    
    var tokenIds = [];
    
    var saveTokenId = function(obj){
        tokenIds.push(obj.id);
        let token_id = obj.id;
        
        _.delay(()=>{
                var token=getObj('graphic',token_id);
                if(token){
                    setTokenAttributes(token);
                }
        },100);
        _.delay(()=>{
            tokenIds=_.without(tokenIds,token_id);
        },1000);
    }
    
    var setTokenAttributes = function(obj) {
        if( 'graphic' === obj.get('type') &&
            'token'   === obj.get('subtype')) {
                
            if(!_.contains(tokenIds,obj.id)){
                return;
            }
            
            
            var character = getObj("character", obj.get("represents"));
            
            if(character == undefined){
                return;
            }
            
            var npcattr = getAttrByName(character.id, 'npc');
            
            //log("TokenGenerator: Is "+character.name+" a NPC?  " + npcattr);
            
            if(npcattr != 1){
                return;
            }
            
        
            //set style
            obj.set(`compact_bar`, compactbars);
            
            //set size
            modifyTokenSize(obj);
            
            //set bar 1 (?)
            setBar(obj, 1, bar1);
            
            //set bar 2 (ac)
            setBar(obj, 2, bar2);
            
            //set bar 3 (hp)
            setBar(obj, 3, bar3);
            
            obj.set(`showplayers_bar1`, showbar1);
            obj.set(`showplayers_bar2`, showbar2);
            obj.set(`showplayers_bar3`, showbar3);
        }
       
    };
    
    var modifyTokenSize = function(obj){
        //log("TokenGenerator: modify size");
        
        var character = getObj("character", obj.get("represents"));
        var npcType = getAttrByName(character.id, 'npc_type').toLowerCase(); 
        if(npcType.includes("tiny")){
            obj.set(`height`, 20);
            obj.set(`width`, 20);
        }
        if(npcType.includes("small")){
            obj.set(`height`, 40);
            obj.set(`width`, 40);
        }
        if(npcType.includes("medium")){
            obj.set(`height`, 70);
            obj.set(`width`, 70);
        }
        if(npcType.includes("large")){
            obj.set(`height`, 140);
            obj.set(`width`, 140);
        }
        if(npcType.includes("huge")){
            obj.set(`height`, 210);
            obj.set(`width`, 210);
        }
        if(npcType.includes("gargantuan") || npcType.includes("giant")){
            obj.set(`height`, 280);
            obj.set(`width`, 280);
        }
        
    }
    
    var setBar = function(obj, bar, barAttribute){
        if(barAttribute == ""){
            return;
        }
        if(barAttribute == "npc_hpformula"){
            if(obj.get(`bar${bar}_max`) > 0){
                return;
            }
        }
        //log("TokenGenerator: " + obj.get("represents"));
        
        var character = getObj("character", obj.get("represents"));
        
        //set HP
        var attr = getAttrByName(character.id, barAttribute);
        if(barAttribute == "npc_hpformula"){
            sendChat("TokenGenerator", "/roll " + attr, function(ops) {
                var rollresult = ops[0].content;
                rollresult = JSON.parse(ops[0].content).total;
                obj.set(`bar${bar}_value`, rollresult);
                obj.set(`bar${bar}_max`, rollresult);
            });
        } else{
            obj.set(`bar${bar}_value`, attr);
            obj.set(`bar${bar}_max`, attr);
        }
        
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
    
    var registerEventHandlers = function() {
        on('add:graphic', saveTokenId);
        //on('change:graphic', setTokenAttributes);
        WarlockManager.RegisterObserver('add:token', saveTokenId);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers,
    };
}());

on("ready",function(){
    'use strict';
    TokenGenerator.CheckInstall(); 
    TokenGenerator.RegisterEventHandlers();
});