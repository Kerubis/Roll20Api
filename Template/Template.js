// Github:   https://github.com/Kerubis/Roll20Api/Template
// By:       Kerubis
var API_Meta = API_Meta || {}; //eslint-disable-line no-var
var Template = Template || (function () {
    'use strict';

    var version = '0.0.1';
    var lastUpdate = 1687440254;

    //Replace Template with new API Name
    var scriptName = 'Template';
    //Update your API Command
    var apiCall = '!Template';


    var msgConst = { "content": apiCall, "playerid": "gm", "type": "api", "who": "gm" }

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
    }
    //Parse Commands
    var cmdMenu = function (msg, params) {
        var output = getMenu(msg);
        sendOutput(msg, output);
    }
    var cmdChangeOutputType = function (msg, params) {
        var isGm = isPlayerGm(msg.playerid);
        if (!isGm) {
            return;
        }
        if (params[1] !== undefined) {
            state.Template.config.outputType = params[1];
        }
    }
    var cmdBackupConfig = function (msg, params) {
        backupConfig();
    }
    var cmdTest = function (msg, params) {
    }
    var unknownCommand = function (msg, params) {
        var response = 'Unknown Command';
        response += '<br>' + params;
        whisper(msgConst, response);
    }

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
    }

    //Utility
    var isPlayerGm = (player) => {
        if (player === 'gm') {
            return true;
        }
        return playerIsGM(player);

    }
    var getHandout = function () {
        const helpIcon = "https://s3.amazonaws.com/files.d20.io/images/127392204/tAiDP73rpSKQobEYm5QZUw/thumb.png?15878425385";

        // find handout
        let props = { type: 'handout', name: `API: ${scriptName}` };
        let handout = findObjs(props)[0];
        if (handout === undefined) {
            handout = createObj('handout', Object.assign(props, { avatar: helpIcon }));
        }
        return handout;
    }
    var updateHandout = function (msg, output) {
        var handout = getHandout();
        var outputStyle = 'width:' + state.Template.config.handoutWidth + 'px;height:' + state.Template.config.handoutHeight + 'px;float:left;overflow-x:hidden;overflow-x:hidden;margin-left:5px;padding:0 5px';

        var menuOutput = '<div style="width:250px;float:left;">' + getMenu(msg) + '</div>';;
        output = '<div style="' + outputStyle + '">' + output + '</div>';

        handout.set("notes", menuOutput + output);
    }
    var backupConfig = function () {
        var handout = getHandout();
        handout.set("gmnotes", JSON.stringify(state.Template, null, 2));
    }
    var parseJson = function (str) {
        var obj;
        try {
            obj = JSON.parse(str);
        } catch (e) {
            return undefined;
        }
        return obj;
    }

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
    }
    var link = function (linkHref, linkDisplayName, addStyle) {
        var styleLink = 'color:black; background:none;font-size:10px;padding:0;margin:0;font-weight: bold;border:0;';
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
    }
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
    }

    //Chat functions
    const sendOutput = function (msg, output) {
        var isGm = isPlayerGm(msg.playerid);
        var outputType = state.Template.config.outputType;
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
    }
    const chat = function (message) {
        var divStyle = 'border:1px solid black;border-radius:5px;padding:4px;background-color:white;';
        message = '<div style="' + divStyle + '">' + message + '</div>';
        sendChat(scriptName, message, { noarchive: true });
    }
    const whisper = function (msg, message) {
        var who = msg.who.replace(" (GM)", "");
        var type = '/w';

        var divStyle = 'border:1px solid black;border-radius:5px;padding:4px;background-color:white;';
        message = '<div style="' + divStyle + '">' + message + '</div>';
        sendChat(scriptName, type + " " + who + " " + message, { noarchive: true });
    }


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
    }

    //API Functions
    var checkInstall = function () {
        if (!state.Template) {
            state.Template = state.Template || {};
            state.Template = {
                config: {
                    version: 0
                }
            };
            whisper(msgConst, scriptName + ' Initialized');
            getHandout();
        }
        if (state.Template.config.version !== version) {
            whisper(msgConst, 'Update Version from ' + state.Template.config.version + ' to ' + version);
            state.Template.config.version = version;

            if (!state.Template.config.outputType) { state.Template.config.outputType = 'whisper' }
        }
        log(scriptName + ' Started');
    }
    var registerEventHandlers = function () {
        on('chat:message', handleInput);
        //on('add:page', handeNewMap);
        //on('change:page', handleUpdateMap);
        //on('change:graphic', setTokenAttributes);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };
}());

on("ready", function () {
    'use strict';
    Template.CheckInstall();
    Template.RegisterEventHandlers();
});