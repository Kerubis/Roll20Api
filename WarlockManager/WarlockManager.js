// Github:   https://github.com/Kerubis/Roll20Api/WarlockManager
// By:       Kerubis
var API_Meta = API_Meta || {}; //eslint-disable-line no-var
const WarlockManager = (() => {
    'use strict';

    var version = '0.0.2';
    var lastUpdate = 1684106306;
    var observers = {
        "add:token": [],
    };

    //Replace WarlockManager with new API Name
    var scriptName = 'WarlockManager';
    //Update your API Command
    var apiCall = '!wm';


    var msgConst = { "content": apiCall, "playerid": "gm", "type": "api", "who": "gm" };

    const handleCommand = function (msg, params) {
        if (params[0] === '') {
            cmdMenu(msg, params);
            return;
        }
        switch (params[0]) {
            case "menu":
                cmdMenu(msg, params);
                break;
            case "help":
                cmdMenu(msg, params);
                break;
            case "addwarlock":
                cmdAddWarlock(msg, params);
                break;
            case "changepatreonname":
                cmdChangePatreonName(msg, params);
                break;
            case "increasesoulcounter":
                cmdIncreaseSoulCounter(msg, params);
                break;
            case "setsoulcounter":
                cmdSetSoulCounter(msg, params);
                break;
            case "addsummon":
                cmdAddSummon(msg, params);
                break;
            case "removesummon":
                cmdRemoveSummon(msg, params);
                break;
            case "changesummonname":
                cmdChangeSummonName(msg, params);
                break;
            case "changesummontext":
                cmdChangeSummonText(msg, params);
                break;
            case "changesummoncounter":
                cmdChangeSummonCounter(msg, params);
                break;
            case "summon":
                cmdSummon(msg, params);
                break;
            case "summontarget":
                cmdSummonTarget(msg, params);
                break;
            case "changeoutputtype":
                cmdChangeOutputType(msg, params);
                break;
            case "backup":
                cmdBackupConfig(msg, params);
                break;
            case "test":
                cmdTest(msg, params)
                break;
            default:
                unknownCommand(msg, params[0]);
        }
    };
    //Parse Commands
    var cmdMenu = function (msg, params) {
        var output = getMenu(msg);
        sendOutput(msg, output);
    };
    var cmdAddWarlock = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) { return; }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        if (warlock !== undefined) {
            whisper(msgConst, 'Warlock already added.');
            return;
        }

        const characterId = params[1];
        const patreonName = params.slice(2).join(' ');
        addWarlock(characterId, patreonName)
    };
    var cmdChangePatreonName = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) { return; }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        if (warlock === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addwarlock');
            return;
        }
        const patreonName = params.slice(2).join(' ');
        changePatreonName(warlock, patreonName);
    };
    var cmdIncreaseSoulCounter = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) { return; }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        if (warlock === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addwarlock');
            return;
        }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        var souls = parseInt(warlock.soulcounter) + 1;
        setSoulCounter(warlock.id, souls);
    };
    var cmdSetSoulCounter = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) { return; }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        if (warlock === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addwarlock');
            return;
        }
        var souls = params[2];
        setSoulCounter(warlock.id, souls);

    };
    var cmdAddSummon = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) { return; }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        if (warlock === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addwarlock');
            return;
        }

        addSummonToWarlock(warlock, params[2]);
    };
    var cmdRemoveSummon = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) { return; }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        if (warlock === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addwarlock');
            return;
        }

        removeSummonFromWarlock(warlock, params[2]);
    };
    var cmdChangeSummonName = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) { return; }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        if (warlock === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addwarlock');
            return;
        }
        var summon = warlock.summons.find(c => c.id === params[2]);
        if (summon === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addsummon');
            return;
        }
        const summonName = params.slice(3).join(' ');
        changeSummonName(summon, summonName);
    };
    var cmdChangeSummonText = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) { return; }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        if (warlock === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addwarlock');
            return;
        }
        var summon = warlock.summons.find(c => c.id === params[2]);
        if (summon === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addsummon');
            return;
        }
        const summonText = params.slice(3).join(' ');
        changeSummonText(summon, summonText);
    };
    var cmdChangeSummonCounter = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) { return; }

        var warlock = state.WarlockManager.Characters.find(c => c.id === params[1]);
        if (warlock === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addwarlock');
            return;
        }
        var summon = warlock.summons.find(c => c.id === params[2]);
        if (summon === undefined) {
            whisper(msgConst, 'Character is not defined as a Warlock, use !wm addsummon');
            return;
        }
        var summonCounter = parseInt(params[3])
        changeSummonCounter(summon, summonCounter);
    };
    var cmdSummon = function (msg, params) {
        var summonerToken = getObj("graphic", params[1]);
        if (summonerToken === undefined) {
            whisper(msg, 'Can not find token!');
            return;
        }
        if ('graphic' !== summonerToken.get('type') || 'token' !== summonerToken.get('subtype')) {
            whisper(msg, 'Token is not a character!');
            return;
        }
        var summonerCharacter = getObj("character", summonerToken.get("represents"));
        var warlock = state.WarlockManager.Characters.find(c => c.id === summonerToken.get("represents"));
        if (warlock === undefined) {
            whisper(msg, summonerCharacter.get('name') + ' is not allowed to summon!');
            return;
        }
        var output = '';
        for (var key in warlock.summons) {
            var summon = warlock.summons[key];

            var summonCharacter = getObj("character", summon.id);
            const imgsrc = getCleanImgsrc(summonCharacter.get('avatar'));

            const href = '!wm summontarget ' + summonerToken.id + ' ' + summon.id;
            var content = 'Summon ';
            content += '<img src="' + imgsrc + '" style="width:20px; height:20px;"/> '
            content += getSummonName(warlock, summon);
            output += link(href, content);
            output += '<br>';
        }
        whisper(msg, output);
    };
    var cmdSummonTarget = function (msg, params) {
        var summonerToken = getObj("graphic", params[1]);
        if (summonerToken === undefined) {
            return;
        }
        if ('graphic' === summonerToken.get('type') &&
            'token' === summonerToken.get('subtype')) {
            var warlock = state.WarlockManager.Characters.find(c => c.id === summonerToken.get('represents'));
            if (warlock === undefined) {
                return;
            }
            var summon = warlock.summons.find(c => c.id === params[2]);
            if (summon === undefined) {
                whisper(msg, 'Summon not found');
                return;
            }
            var pageId = Campaign().get("playerpageid");
            if (isPlayerGm(msg.playerid)) {
                var player = getObj('player', msg.playerid);
                pageId = player.get('lastpage');
            }
            summonTarget(warlock, summon, pageId, summonerToken.get('top'), summonerToken.get('left'));
        }
    };
    var cmdChangeOutputType = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) {
            return;
        }
        if (params[1] !== undefined) {
            state.WarlockManager.config.outputType = params[1];
        }
    };
    var cmdBackupConfig = function (msg, params) {
        backupConfig();
    };
    var cmdTest = function (msg, params) {
        //state.WarlockManager = undefined;
        //checkInstall();
        whisper(msgConst, JSON.stringify(state.WarlockManager));
    };
    var unknownCommand = function (msg, params) {
        var response = 'Unknown Command';
        response += '<br>' + params;
        whisper(msgConst, response);
    };
    //Functions 
    var addWarlock = function (characterId, patreonName) {
        var newWarlock = {
            id: characterId,
            soulcounter: 0,
            linkedAttribute: 'other_resource',
            patreonName: patreonName,
            summons: []
        };
        state.WarlockManager.Characters.push(newWarlock);
        whisper(msgConst, JSON.stringify(state.WarlockManager.Characters));
    };
    var changePatreonName = function (warlock, patreonName) {
        warlock.patreonName = patreonName;
    };
    var setSoulCounter = function (characterId, souls) {
        var warlock = state.WarlockManager.Characters.find(c => c.id === characterId);
        var character = getObj("character", warlock.id);
        var attr = getAttr(character.id, warlock.linkedAttribute);

        warlock.soulcounter = souls;
        attr.setWithWorker({ current: warlock.soulcounter });

        const msg = { "type": "api", "who": character.get('name') }
        const content = 'You collected ' + souls + ' souls for ' + warlock.patreonName + '!';
        whisper(msg, content);
    };
    var addSummonToWarlock = function (warlock, summonId) {
        var summonCharacter = getObj("character", summonId);
        var newSummon = {
            id: summonId,
            name: summonCharacter.get('name'),
            summoncounter: 0,
            summontext: '%2 was summoned by %1',
        };

        warlock.summons.push(newSummon);
    };
    var removeSummonFromWarlock = function (warlock, summonId) {
        var summon = warlock.summons.find(c => c.id === summonId);
        var index = warlock.summons.indexOf(summon);
        warlock.summons.splice(index, 1);
    };
    var changeSummonName = function (summon, summonName) {
        summon.name = summonName;
    };
    var changeSummonText = function (summon, summonText) {
        summon.summontext = summonText;
    };
    var changeSummonCounter = function (summon, counter) {
        summon.summoncounter = counter;
    };
    var summonTarget = function (warlock, summon, pageId, top, left) {
        var character = getObj("character", summon.id);
        const imgsrc = getCleanImgsrc(character.get('avatar'));

        var token = createObj('graphic', {
            _type: "graphic",
            _subtype: "token",
            _pageid: pageId,
            represents: summon.id,
            layer: "objects",
            isdrawing: false,
            imgsrc: imgsrc,
            top: top,
            left: left,
        });
        toFront(token);

        summon.summoncounter++;
        var attr = getAttr(character.id, "npc_name");
        attr.setWithWorker({ current: getSummonName(warlock, summon) });

        chat(getSummonText(warlock, summon));

        notifyObservers('add:token', token, token.id);
    };
    var getSummonName = function (warlock, summon) {
        var warlockCharacter = getObj("character", warlock.id);
        var returnValue = summon.name
            .replace('%1', warlockCharacter.get('name'))
            .replace('%3', summon.summoncounter);

        return returnValue;
    };
    var getSummonText = function (warlock, summon) {
        var warlockCharacter = getObj("character", warlock.id);
        var returnValue = summon.summontext
            .replace('%1', warlockCharacter.get('name'))
            .replace('%3', summon.summoncounter)
            .replace('%2', getSummonName(warlock, summon));

        return returnValue;
    };
    //get Output
    var getMenu = function (msg) {
        var isGm = isPlayerGm(msg.playerid);
        var output = '';

        //Menu
        if (true) {
            var myTable = table();
            var headerRow = myTable.addRow();
            var headerColumn = headerRow.addColumn('Menu');
            headerColumn.attributes += ' colspan="10"';
            var row1 = myTable.addRow();
            row1.addColumn(link(msg.content, 'Menu'));

            output += myTable.createHtml();
        }
        //Config
        if (isGm) {
            var myTable = table();
            var headerRow = myTable.addRow();
            var headerColumn = headerRow.addColumn('Config')
            headerColumn.attributes += ' colspan="10"';

            var row1 = myTable.addRow();
            row1.style += ' background:#04AA6D;"';
            row1.addColumn(link(apiCall + ' changeoutputtype ?{Output To|Handout,handout|Whisper,whisper|Chat,chat}', 'Output To'));

            output += myTable.createHtml();
        }

        //Admin
        if (isGm) {
            var myTable = table();
            var headerRow = myTable.addRow();
            var headerColumn = headerRow.addColumn('Admin')
            headerColumn.attributes += ' colspan="10"';

            var row2 = myTable.addRow();
            row2.style += ' background:#04AA6D;"';
            row2.addColumn(link(apiCall + ' backup', 'Backup Config'));

            output += myTable.createHtml();
        }
        return output;
    };

    //Utility
    var isPlayerGm = (player) => {
        if (player === 'gm') {
            return true;
        }
        return playerIsGM(player);

    };
    var getHandout = function () {
        const helpIcon = "https://s3.amazonaws.com/files.d20.io/images/127392204/tAiDP73rpSKQobEYm5QZUw/thumb.png?15878425385";

        // find handout
        let props = { type: 'handout', name: `API: ${scriptName}` };
        let handout = findObjs(props)[0];
        if (handout === undefined) {
            handout = createObj('handout', Object.assign(props, { avatar: helpIcon }));
        }
        return handout;
    };
    var updateHandout = function (msg, output) {
        var handout = getHandout();
        var outputStyle = 'width:' + state.WarlockManager.config.handoutWidth + 'px;height:' + state.WarlockManager.config.handoutHeight + 'px;float:left;overflow-x:hidden;overflow-x:hidden;margin-left:5px;padding:0 5px';

        var menuOutput = '<div style="width:250px;float:left;">' + getMenu(msg) + '</div>';;
        output = '<div style="' + outputStyle + '">' + output + '</div>';

        handout.set("notes", menuOutput + output);
    };
    var backupConfig = function () {
        var handout = getHandout();
        handout.set("gmnotes", JSON.stringify(state.WarlockManager, null, 2));
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
    var getCleanImgsrc = function (imgsrc) {
        var parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?$/);
        if (parts) {
            return parts[1] + 'thumb' + parts[3] + (parts[4] ? parts[4] : `?${Math.round(Math.random() * 9999999)}`);
        }
        return;
    };
    var parseJson = function (str) {
        var obj;
        try {
            obj = JSON.parse(str);
        } catch (e) {
            return undefined;
        }
        return obj;
    };

    //HTML Parser
    var table = function () {
        var styleTable = 'margin-bottom:5px;';
        var styleRow = '';
        var styleColumn = 'margin:0;padding:0 3px 0 3px;border:1px solid black;';

        var myTable = {
            style: styleTable,
            rows: [],
            addRow: function () {
                var row = {
                    attributes: '',
                    style: styleRow,
                    columns: [],
                    addColumn: function (columnContent) {
                        var column = {
                            attributes: '',
                            style: styleColumn,
                            content: columnContent
                        }
                        var columnKey = this.columns.push(column) - 1;
                        return this.columns[columnKey];
                    }
                }
                var rowKey = this.rows.push(row) - 1;
                return this.rows[rowKey];
            },
            createHtml: function () {
                var html = '<table style="' + this.style + '">';
                for (var rowKey in myTable.rows) {
                    html += '<tr ' + myTable.rows[rowKey].attributes + ' style="' + myTable.rows[rowKey].style + '">';
                    for (var columnKey in myTable.rows[rowKey].columns) {
                        html += '<td ' + myTable.rows[rowKey].columns[columnKey].attributes + ' style="' + myTable.rows[rowKey].columns[columnKey].style + '">';
                        html += myTable.rows[rowKey].columns[columnKey].content;
                        html += '</td>';
                    }
                    html += '</tr>';
                }
                html += '</table>';
                return html;
            }
        }
        return myTable;
    };
    var link = function (linkHref, linkDisplayName, addStyle) {
        var styleLink = 'color:black; background:none;font-size:15px;padding:0;margin:0;border:0;';
        var myLink = {
            style: styleLink + addStyle,
            href: linkHref,
            displayText: linkDisplayName,
            createHtml: function () {
                var html = '<a style="' + this.style + '" href="' + this.href + '">';
                html += this.displayText;
                html += '</a>';
                return html;
            }
        }
        return myLink.createHtml();
    };
    var span = function (spanContent, addStyle) {
        var spanStyle = 'color:black; background:none;font-size:10px;padding:0;margin:0;font-weight: bold;border:0;';
        var mySpan = {
            style: spanStyle + addStyle,
            content: spanContent,
            createHtml: function () {
                var html = '<span style="' + this.style + '">';
                html += this.content;
                html += '</span>';
                return html;
            }
        }
        return mySpan.createHtml();
    };

    //Chat functions
    const sendOutput = function (msg, output) {
        var isGm = isPlayerGm(msg.playerid);
        var outputType = state.WarlockManager.config.outputType;
        if (!isGm) {
            outputType = 'whisper';
        }
        switch (outputType) {
            case 'handout':
                updateHandout(msg, output)
                break;
            case 'whisper':
                whisper(msg, output)
                break;
            case 'chat':
                chat(output)
                break;
            default:
                whisper(msg, output)
                break;
        }
    };
    const chat = function (message) {
        var divStyle = 'border:1px solid black;border-radius:5px;padding:4px;background-color:white;';
        message = '<div style="' + divStyle + '">' + message + '</div>';
        sendChat(scriptName, message, { noarchive: true });
    };
    const whisper = function (msg, message) {
        var who = msg.who.replace(" (GM)", "");
        var type = '/w';

        var divStyle = 'border:1px solid black;border-radius:5px;padding:4px;background-color:white;';
        message = '<div style="' + divStyle + '">' + message + '</div>';
        sendChat(scriptName, type + " " + who + " " + message, { noarchive: true });
    };

    //Observer
    var notifyObservers = function (event, obj, prev) {
        observers[event].forEach(observer => observer(obj, prev));
    };
    var registerObserver = function (event, observer) {
        if (observer && _.isFunction(observer) && observers.hasOwnProperty(event)) {
            observers[event].push(observer);
        } else {
            log("Warlock Manager - Could not register Observer.");
        }
    };

    //Event Handlers
    var handleInput = function (msg) {
        if (msg.type !== "api") {
            return;
        }
        if (!msg.content.startsWith(apiCall)) {
            return;
        }
        let args = msg.content.replace(apiCall, '').trim().split(/\s/);
        handleCommand(msg, args);
    };

    //API Functions
    var checkInstall = function () {
        if (!state.WarlockManager) {
            state.WarlockManager = state.WarlockManager || {};
            state.WarlockManager = {
                config: {
                    version: 0
                }
            };
            whisper(msgConst, scriptName + ' Initialized');
            getHandout();
        }
        if (state.WarlockManager.config.version !== version) {
            whisper(msgConst, 'Update Version from ' + state.WarlockManager.config.version + ' to ' + version);
            state.WarlockManager.config.version = version;

            if (!state.WarlockManager.config.outputType) { state.WarlockManager.config.outputType = 'whisper' }
            if (!state.WarlockManager.Characters) { state.WarlockManager.Characters = [] }
        }
        log(scriptName + ' Started');
    };
    var registerEventHandlers = function () {
        on('chat:message', handleInput);
        //on('add:page', handeNewMap);
        //on('change:page', handleUpdateMap);
        //on('add:graphic', handleAddGraphic);
        //on('change:graphic', handleChangeGraphic);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers,
        RegisterObserver: registerObserver,
    };
})();

on("ready", function () {
    'use strict';
    WarlockManager.CheckInstall();
    WarlockManager.RegisterEventHandlers();
});