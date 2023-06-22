// Github:   https://github.com/Kerubis/Roll20Api/NPCToken
// By:       Kerubis
var API_Meta = API_Meta || {}; //eslint-disable-line no-var
var NPCToken = NPCToken || (function () {
    'use strict';

    var version = '0.0.2';
    var lastUpdate = 1687440254;

    var bar1 = '';
    var bar2 = 'npc_ac';
    var bar3 = 'npc_hpformula';
    var showbar1 = false;
    var showbar2 = false;
    var showbar3 = true;
    var compactbars = `compact`;

    var tokenIds = [];

    var saveTokenId = function (obj) {
        tokenIds.push(obj.id);
        let token_id = obj.id;

        _.delay(() => {
            var token = getObj('graphic', token_id);
            if (token) {
                setTokenAttributes(token);
            }
        }, 100);
        _.delay(() => {
            tokenIds = _.without(tokenIds, token_id);
        }, 1000);
    }

    var setTokenAttributes = function (obj) {
        if ('graphic' === obj.get('type') &&
            'token' === obj.get('subtype')) {

            if (!_.contains(tokenIds, obj.id)) {
                return;
            }

            var character = getObj("character", obj.get("represents"));
            if (character == undefined) {
                return;
            }

            var npcattr = getAttrByName(character.id, 'npc');
            if (npcattr != 1) {
                return;
            }

            obj.set(`compact_bar`, compactbars);
            modifyTokenSize(obj);
            setBar(obj, 1, bar1);
            setBar(obj, 2, bar2);
            setBar(obj, 3, bar3);

            obj.set(`showplayers_bar1`, showbar1);
            obj.set(`showplayers_bar2`, showbar2);
            obj.set(`showplayers_bar3`, showbar3);
        }

    };

    var modifyTokenSize = function (obj) {
        var character = getObj("character", obj.get("represents"));
        var npcType = getAttrByName(character.id, 'npc_type').toLowerCase();
        if (npcType.includes("tiny")) {
            obj.set(`height`, 20);
            obj.set(`width`, 20);
        }
        if (npcType.includes("small")) {
            obj.set(`height`, 40);
            obj.set(`width`, 40);
        }
        if (npcType.includes("medium")) {
            obj.set(`height`, 70);
            obj.set(`width`, 70);
        }
        if (npcType.includes("large")) {
            obj.set(`height`, 140);
            obj.set(`width`, 140);
        }
        if (npcType.includes("huge")) {
            obj.set(`height`, 210);
            obj.set(`width`, 210);
        }
        if (npcType.includes("gargantuan") || npcType.includes("giant")) {
            obj.set(`height`, 280);
            obj.set(`width`, 280);
        }

    }

    var setBar = function (obj, bar, barAttribute) {
        if (barAttribute == "") {
            return;
        }
        if (barAttribute == "npc_hpformula") {
            if (obj.get(`bar${bar}_max`) > 0) {
                return;
            }
        }

        var character = getObj("character", obj.get("represents"));
        var attr = getAttrByName(character.id, barAttribute);
        if (barAttribute == "npc_hpformula") {
            sendChat("NPCToken", "/roll " + attr, function (ops) {
                var rollresult = ops[0].content;
                rollresult = JSON.parse(ops[0].content).total;
                obj.set(`bar${bar}_value`, rollresult);
                obj.set(`bar${bar}_max`, rollresult);
            });
        } else {
            obj.set(`bar${bar}_value`, attr);
            obj.set(`bar${bar}_max`, attr);
        }
    };

    var checkInstall = function () {
        log('Token Generator started')
    };
    var registerEventHandlers = function () {
        on('add:graphic', saveTokenId);
        if (typeof WarlockManager !== 'undefined') {
            WarlockManager.RegisterObserver('add:token', saveTokenId);
        }
    };

    return {
        RegisterEventHandlers: registerEventHandlers,
        CheckInstall: checkInstall,
    };
}());

on("ready", function () {
    'use strict';
    NPCToken.CheckInstall();
    NPCToken.RegisterEventHandlers();
});