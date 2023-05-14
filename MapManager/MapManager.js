var MapManager = MapManager || (function () {
    'use strict';

    var version = '1.0.0';
    var lastUpdate = 1683980883;

    var scriptName = 'Map Manager';
    var apiCall = '!mm';


    const handleCommand = function (msg, params) {
        if (params[0] === '') {
            cmdMenu(msg, params);
            return;
        }

        switch (params[0]) {
            case "menu":
                cmdMenu(msg, params);
                return;
            case "help":
                cmdMenu(msg, params);
                return;
            case "list":
                cmdList(msg, params);
                return;
            case "move":
                cmdMove(msg, params);
                return;
            case "moveplayer":
                cmdMovePlayer(msg, params);
                return;
            case "moveall":
                cmdMoveAll(msg, params);
                return;
            case "rejoin":
                cmdReJoin(msg, params);
                return;
            case "rejoinall":
                cmdReJoinAll(msg, params);
                return;
            case "listedit":
                cmdListEdit(msg, params);
                return;
            case "edit":
                cmdEditMap(msg, params);
                return;
            case "update":
                cmdUpdateMapList(msg, params);
                return;
            case "category":
                cmdCategory(msg, params);
                return;
            case "changelimit":
                cmdChangeLimit(msg, params);
                return;
            case "resetmaps":
                cmdResetMaps(msg, params);
                return;
            case "resetcategories":
                cmdResetCategories(msg, params);
                return;
            case "test":
                cmdTest(msg, params)
                return;
            case "Nah":
                whisper(msg.who, 'Woah, no data lost!');
                return;
                break;
        }
        unknownCommand(msg, params[0]);
    }
    //Parse Commands
    var cmdMenu = function (msg, params) {
        showMenu(msg);
    }
    var cmdList = function (msg, params) {
        var isGm = playerIsGM(msg.playerid);
        log(isGm);

        var mapsToList = state.MapManager.maps;
        if (!isGm) {
            mapsToList = mapsToList.filter(m => m.isPublic);
        }
        mapsToList = mapsToList.filter(m => !m.isHidden);

        switch (params[1]) {
            case "top":
                var amount = parseInt(params[2]);
                mapsToList = mapsToList.slice(0, amount);
                break;
            case "last":
                var amount = parseInt(params[2]);
                mapsToList = mapsToList.slice(-amount);
                break;
            case "public":
                mapsToList = mapsToList.filter(m => m.isPublic);
                break;
            case "category":
                mapsToList = getMapsWithCategory(mapsToList, params[2]);
                break;
        }

        listMaps(msg, mapsToList)
    }
    var cmdMove = function (msg, params) {
        if (!mapPermission(msg.playerid, params[1])) {
            return;
        }
        var playerPages = Campaign().get("playerspecificpages");
        if (playerPages === false) {
            playerPages = {};
        }
        playerPages[msg.playerid] = params[1];

        Campaign().set("playerspecificpages", false);
        Campaign().set("playerspecificpages", playerPages);
    }
    var cmdMovePlayer = function (msg, params) {
        var playerPages = Campaign().get("playerspecificpages");
        if (playerPages === false) {
            playerPages = {};
        }
        playerPages[params[1]] = params[2];

        Campaign().set("playerspecificpages", false);
        Campaign().set("playerspecificpages", playerPages);
    }
    var cmdMoveAll = function (msg, params) {
        var playerPages = false

        Campaign().set("playerspecificpages", false);
        Campaign().set("playerspecificpages", playerPages);
        Campaign().set("playerpageid", params[1]);
    }
    var cmdReJoin = function (msg, params) {
        var playerPages = Campaign().get("playerspecificpages");
        if (playerPages[msg.playerid] !== undefined) {
            delete playerPages[msg.playerid];
        }
        if (Object.keys(playerPages).length === 0) {
            playerPages = false;
        }
        Campaign().set("playerspecificpages", false);
        Campaign().set("playerspecificpages", playerPages);
    }
    var cmdReJoinAll = function (msg, params) {
        var isGm = playerIsGM(msg.playerid);
        if (!isGm) {
            return;
        }
        Campaign().set("playerspecificpages", false);
    }
    var cmdListEdit = function (msg, params) {
        var isGm = playerIsGM(msg.playerid);
        if (!isGm) {
            return;
        }

        var mapsToList = state.MapManager.maps;

        if (params[1] !== undefined) {
            switch (params[1]) {
                case "all":
                    break;
                case "hidden":
                    mapsToList = mapsToList.filter(m => m.isHidden)
                    break;
                default:
                    mapsToList = [mapsToList.find(m => m.id === params[1])];
                    break;
            }
        } else {
            mapsToList = mapsToList.filter(m => !m.isHidden);
        }
        listEdit(msg, mapsToList);
    }
    var cmdEditMap = function (msg, params) {
        var mapToChange = state.MapManager.maps.find(m => m.id === params[1]);

        switch (params[2]) {
            case "togglepublic":
                mapToChange.isPublic = !mapToChange.isPublic;
                break;
            case "togglehidden":
                mapToChange.isHidden = !mapToChange.isHidden;
                break;
        }
    }
    var cmdUpdateMapList = function (msg, params) {
        updateMapList(msg);
    }
    var cmdCategory = function (msg, params) {
        switch (params[1]) {
            case "new":
                newCategory(params[2]);
                break;
            case "add":
                addCategoryToMap(params[2], params[3]);
                break;
            case "assign":
                assignCategoryToMap(params[2]);
                break;
            default:
                listCategories(msg);
                break;
        }
    }
    var cmdChangeLimit = function (msg, params) {
        var isGm = playerIsGM(msg.playerid);
        if (!isGm) {
            return;
        }
        switch (params[1]) {
            case "top":
                state.MapManager.config.listTopAmount = params[2];
                break;
            case "last":
                state.MapManager.config.listLastAmount = params[2];
                break;
        }
    }
    var cmdResetMaps = function (msg, params) {
        resetMaps(msg);
    }
    var cmdResetCategories = function (msg, params) {
        resetCategories(msg);
    }
    var cmdTest = function (msg, params) {
        log('No Test implemented');
        whisper('gm', 'No Test implemented');
    }
    var unknownCommand = function (msg, params) {
        var response = 'Unknown Command';
        response += '<br>' + params;
        whisper(msg.who, response);
    }

    //Functions
    var showMenu = function (msg) {
        var isGm = playerIsGM(msg.playerid);
        var output = '';
        var imgCogwheel = '<img src="https://s3.amazonaws.com/files.d20.io/images/341389502/7PX4fvcTsdEZ0_6vkN_tLw/max.png?1683853925" style="margin-top:-4px;" width="10px" height="10px">';

        var categoryDropdown = '?{Player';
        for (var key in state.MapManager.categories) {
            var category = state.MapManager.categories[key];
            categoryDropdown += "|" + category;
        }
        categoryDropdown += '}';

        //Menu
        if (true) {
            var myTable = table();
            var headerRow = myTable.addRow();
            var headerColumn = headerRow.addColumn('Menu');
            headerColumn.attributes += ' colspan="10"';
            var row1 = myTable.addRow();
            row1.addColumn(link(apiCall, 'Menu'));

            output += myTable.createHtml();
        }

        //List
        if (true) {
            var myTable = table();
            var headerRow = myTable.addRow();
            var headerColumn = headerRow.addColumn('List')
            headerColumn.attributes += ' colspan="10"';

            var row1 = myTable.addRow();
            row1.style += ' background:#04AA6D;"';
            if (isGm) {
                row1.addColumn(link(apiCall + ' list', 'Maps'));
                row1.addColumn(link(apiCall + ' list public', 'Public'));
                row1.addColumn(link(apiCall + ' list category ' + categoryDropdown, 'Category'));
            } else {
                row1.addColumn(link(apiCall + ' list', 'Maps'));
            }
            output += myTable.createHtml();
        }

        //Edit
        if (isGm) {
            var myTable = table();
            var headerRow = myTable.addRow();
            var headerColumn = headerRow.addColumn('Edit')
            headerColumn.attributes += ' colspan="10"';

            var row1 = myTable.addRow();
            row1.style += ' background:#04AA6D;"';
            row1.addColumn(link(apiCall + ' listedit', 'Maps'));
            row1.addColumn(link(apiCall + ' listedit hidden', 'Hidden'));
            row1.addColumn(link(apiCall + ' listedit all', 'All'));
            output += myTable.createHtml();
        }

        //Category
        if (isGm) {
            var myTable = table();
            var headerRow = myTable.addRow();
            var headerColumn = headerRow.addColumn('Category')
            headerColumn.attributes += ' colspan="10"';

            var row1 = myTable.addRow();
            row1.style += ' background:#04AA6D;"';
            row1.addColumn(link(apiCall + ' category', 'Category'));
            output += myTable.createHtml();
        }

        //Util
        if (true) {
            var myTable = table();
            var headerRow = myTable.addRow();
            var headerColumn = headerRow.addColumn('Utility')
            headerColumn.attributes += ' colspan="10"';

            var row1 = myTable.addRow();
            row1.style += ' background:#04AA6D;"';
            row1.addColumn(link(apiCall + ' rejoin', 'Rejoin'));
            row1.addColumn(link(apiCall + ' rejoinall', 'Rejoin All'));
            output += myTable.createHtml();
        }

        //Admin
        if (isGm) {
            var myTable = table();
            var headerRow = myTable.addRow();
            var headerColumn = headerRow.addColumn('Admin')
            headerColumn.attributes += ' colspan="10"';

            var row1 = myTable.addRow();
            row1.style += ' background:#04AA6D;"';
            row1.addColumn(link(apiCall + ' updatemaps', 'Update Maps'));
            row1.addColumn(link(apiCall + '  ?{U sure?|Nah,|Reset,resetmaps}', 'Reset Maps'));
            row1.addColumn(link(apiCall + '  ?{U sure?|Nah,|Reset,resetcategories}', 'Reset Categories'));
            output += myTable.createHtml();
        }
        whisper(msg.who, output)
    }
    var listMaps = function (msg, mapsToList) {
        if (mapsToList.length === 0) {
            return;
        }

        var isGm = playerIsGM(msg.playerid);
        if (msg.playerid === 'gm') {
            isGm = true;
        }
        var who = msg.who;

        var imgCogwheel = '<img src="https://s3.amazonaws.com/files.d20.io/images/341389502/7PX4fvcTsdEZ0_6vkN_tLw/max.png?1683853925" style="margin-top:-4px;" width="10px" height="10px">'

        var players = findObjs({ _type: 'player' });
        var playerDropdown = '?{Player';
        for (var key in players) {
            var playerId = _.escape(players[key].get("_id"));
            var playerName = _.escape(players[key].get("_displayname"));
            playerDropdown += "|" + playerName + ',' + playerId;
        }
        playerDropdown += '}';

        var myTable = table();
        var headerRow = myTable.addRow();
        var headerColumn = headerRow.addColumn('Maps');
        headerColumn.attributes = 'colspan="10"';
        for (var key in mapsToList) {
            var map = mapsToList[key];
            var publicStyle = (map.isPublic ? 'color:#04AA6D;' : 'color:#ff0800;');

            var row = myTable.addRow();
            row.addColumn(link(apiCall + ' move ' + map.id, map.name, publicStyle));
            if (isGm) {
                row.addColumn(link(apiCall + ' moveall ' + map.id, 'All'));
                row.addColumn(link(apiCall + ' moveplayer ' + playerDropdown + ' ' + map.id, 'Player'));
                row.addColumn(link(apiCall + ' listedit ' + map.id, imgCogwheel));
            }
        }
        var output = myTable.createHtml();
        output += getMessageFooter(isGm);
        whisper(who, output);
    }
    var listEdit = function (msg, mapsToList) {
        var myTable = table();
        var headerRow = myTable.addRow();
        var headerColumn = headerRow.addColumn('Maps');
        headerColumn.attributes = 'colspan="10"';

        for (var key in mapsToList) {
            var map = mapsToList[key];
            var publicStyle = (map.isPublic ? 'color:#04AA6D;' : 'color:#ff0800;');
            var hiddenStyle = (map.isHidden ? 'color:#04AA6D;' : 'color:#ff0800;');

            var row = myTable.addRow();
            row.addColumn(span(map.name));
            row.addColumn(link(apiCall + ' edit ' + map.id + ' togglepublic', 'Public', publicStyle));
            row.addColumn(link(apiCall + ' edit ' + map.id + ' togglehidden', 'Hidden', hiddenStyle));

            var categoryDropdown = '?{Category';
            for (var key in state.MapManager.categories) {
                var category = state.MapManager.categories[key];
                categoryDropdown += "|" + category;
            }
            categoryDropdown += '}';

            row.addColumn(link(apiCall + ' category add ' + categoryDropdown + ' ' + map.id, 'Category'));
        }
        var output = myTable.createHtml();
        output += getMessageFooter(true);
        whisper(msg.who, output);
    }
    var updateMapList = function (msg) {
        var mapsToList = [];

        var pages = findObjs({ _type: 'page' });
        for (var key in pages) {
            if (pages.hasOwnProperty(key)) {
                var page = pages[key];
                addNewMap(page);
                var mapToList = updateMap(page);
                if (mapToList !== false) {
                    mapsToList.push(mapToList);
                }
            }
        }
        listMaps(msg, mapsToList);
    }
    var addNewMap = function (newMap) {
        var mapId = newMap.get("_id");
        var mapName = newMap.get("name");

        var obj = state.MapManager.maps.find(m => m.id === mapId);
        if (obj === undefined) {
            var mapObj = { id: mapId }

            var mapsToList = state.MapManager.maps.push(mapObj);
        }
    }
    var updateMap = function (newMap) {
        var mapId = newMap.get("_id");
        var mapName = newMap.get("name");

        var updated = false;
        var obj = state.MapManager.maps.find(m => m.id === mapId);
        if (obj !== undefined) {
            if (obj.name !== mapName) { obj.name = mapName; updated = true; }
            if (obj.isPublic === undefined) { obj.isPublic = false; updated = true; }
            if (obj.isHidden === undefined) { obj.isHidden = false; updated = true; }
        }

        if (updated) {
            return obj;
        }
        return false;
    }
    var listCategories = function (msg) {
        var categoryTable = table();
        var categoryHeaderRow = categoryTable.addRow();
        var categoryHeaderColum = categoryHeaderRow.addColumn('Categories');
        categoryHeaderColum.attributes += ' colspan="10"';
        for (var categoryKey in state.MapManager.categories) {
            var category = state.MapManager.categories[categoryKey];
            var categoryRow = categoryTable.addRow();
            categoryRow.addColumn(link(apiCall + ' list category ' + category, category));
            categoryRow.addColumn(link(apiCall + ' category assign ' + category, 'Assign Maps'));
        }
        whisper('gm', categoryTable.createHtml());
    }
    var newCategory = function (newCategory) {
        if (!state.MapManager.categories.includes(newCategory)) {
            state.MapManager.categories.push(newCategory);
        }
    }
    var addCategoryToMap = function (category, map) {
        var map = state.MapManager.maps.find(m => m.id === map);
        if (map.categories === undefined) {
            map.categories = [];
        }
        if (!map.categories.includes(category)) {
            map.categories.push(category);
        }
    }
    var assignCategoryToMap = function (category) {
        var mapTable = table();
        var mapHeaderRow = mapTable.addRow();
        var mapHeaderColum = mapHeaderRow.addColumn('Assign Maps to ' + category)
        mapHeaderColum.attributes += ' colspan="10"'
        for (var mapKey in state.MapManager.maps) {
            var map = state.MapManager.maps[mapKey];
            var mapRow = mapTable.addRow();
            mapRow.addColumn(link(apiCall + ' category add ' + category + ' ' + map.id, map.name));
        }
        var output = mapTable.createHtml();
        output += getMessageFooter(true);
        whisper('gm', output)
    }
    var getMapsWithCategory = function (mapsToList, category) {
        log(category);
        mapsToList = mapsToList.filter(m => m.categories !== undefined);
        log(mapsToList);
        mapsToList = mapsToList.filter(m => m.categories.includes(category));
        log(mapsToList);
        return mapsToList;
    }
    var resetMaps = function (msg) {
        state.MapManager.maps = [];
        updateMapList(msg);
    }
    var resetCategories = function (msg) {
        state.MapManager.categories = [];
        var mapsToCheck = state.MapManager.maps.filter(m => m.categories !== undefined);
        mapsToCheck = mapsToCheck.filter(m => m.categories.length !== 0);
        for (var mapKey in mapsToCheck) {
            var map = mapsToCheck[mapKey];
            for (var categoryKey in map.categories) {
                var category = map.categories[categoryKey];
                newCategory(state.MapManager.categories.push(category));
            }
        }
    }

    //Utility
    var getMessageFooter = function (isGm) {
        var output = getUtilTable(isGm);
        output += getNavTable(isGm);
        return output;
    }
    var getUtilTable = function (isGm) {
        var utilTable = table();
        var utilHeaderRow = utilTable.addRow();
        var utilHeaderColumn = utilHeaderRow.addColumn('Utility')
        utilHeaderColumn.attributes += ' colspan="10"';

        var utilRow1 = utilTable.addRow();
        utilRow1.style += ' background:#04AA6D;"'
        if (isGm) {
            utilRow1.addColumn(link(apiCall + ' rejoinall', 'Rejoin All'));
        } else {
            utilRow1.addColumn(link(apiCall + ' rejoin', 'Rejoin'));
        }
        return utilTable.createHtml()
    }
    var getNavTable = function (isGm) {
        var navTable = table();
        var navHeaderRow = navTable.addRow();
        var navHeaderColumn = navHeaderRow.addColumn('Navigation')
        navHeaderColumn.attributes += ' colspan="10"';

        var navRow1 = navTable.addRow();
        navRow1.style += ' background:#04AA6D;"'
        if (isGm) {
            navRow1.addColumn(link(apiCall + ' list', 'Maps'));
            navRow1.addColumn(link(apiCall + ' list public', 'Public'));
            navRow1.addColumn(link(apiCall + ' list top ' + state.MapManager.config.listTopAmount, 'Top ' + state.MapManager.config.listTopAmount));
            navRow1.addColumn(link(apiCall + ' list last ' + state.MapManager.config.listLastAmount, 'Last ' + state.MapManager.config.listLastAmount));
            navRow1.addColumn(link(apiCall + ' category', 'Categories'));
            var navRow2 = navTable.addRow();
            navRow2.style += ' background:#04AA6D;"'
            navRow2.addColumn(link(apiCall, "Menu"));
            navRow2.addColumn(link(apiCall + ' listedit', "Edit Maps"));
        } else {
            navRow1.addColumn(link(apiCall + ' list', 'Maps'));
        }
        return navTable.createHtml()
    }
    var mapPermission = function (playerId, mapId) {
        var isGm = playerIsGM(playerId);
        var obj = state.MapManager.maps.find(m => m.id === mapId);
        if (obj === undefined) {
            return false;
        }
        if (isGm) {
            return true;
        }
        if (obj.public) {
            return true;
        }
        return false;
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
    var updateHandout = function () {
        var handout = getHandout();
        handout.set("notes", JSON.stringify(state.MapManager, null, 2));
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
    const chat = function (message) {
        var divStyle = 'border:1px solid black;border-radius:5px;padding:4px;background-color:white;';
        message = '<div style="' + divStyle + '">' + message + '</div>';
        sendChat(scriptName, message, { noarchive: true });
    }
    const whisper = function (to, message) {
        var who = to.replace(" (GM)", "");
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
    var handeNewMap = function (newMap) {
        addNewMap(newMap);
    }
    var handleUpdateMap = function (newMap) {
        var mapsToList = [];
        var mapToList = updateMap(newMap);
        if (mapToList !== false) {
            mapsToList.push(mapToList);
            var msg = { "content": apiCall, "playerid": "gm", "type": "api", "who": "gm" }
            listEdit(msg, mapsToList);
        }
    }

    //API Functions
    var checkInstall = function () {
        if (!state.MapManager) {
            state.MapManager = state.MapManager || {};
            state.MapManager = {
                config: {
                    version: version,
                    listTopAmount: 5,
                    listLastAmount: 5
                },
                maps: [],
                categories: [],
            };
        }
        if (state.MapManager.config.version !== version) {
            whisper('gm', 'Update Version from ' + state.MapManager.config.version + ' to ' + version);
            state.MapManager.config.version = version;
        }
        whisper('gm', scriptName + ' Started')

        var msg = { "content": apiCall, "playerid": "gm", "type": "api", "who": "gm" }
        updateMapList(msg);
    }
    var registerEventHandlers = function () {
        on('chat:message', handleInput);
        on('add:page', handeNewMap);
        on('change:page', handleUpdateMap);
        //on('change:graphic', setTokenAttributes);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };
}());

on("ready", function () {
    'use strict';
    MapManager.CheckInstall();
    MapManager.RegisterEventHandlers();
});