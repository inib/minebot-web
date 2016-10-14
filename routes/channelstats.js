var express = require('express');
var router = express.Router();
var db = require('../modules/db');
var chatURL = '/api/channel/germandota/initial';
var emoteURL = '/api/emote';

function getIcon(name, group, sub) {
    var icoHTML = '';
    if (name == 'm1nebot') {
        return '<span class="ico bot"></span>';
    }
    else {
        switch (group) {
            case '2':
                icoHTML += '<span class="ico mod"></span>';
                break;
            case '1':
                icoHTML += '<span class="ico staff"></span>';
                break;
            case '0':
                icoHTML += '<span class="ico broad"></span><span class="ico sub"></span>';
                break;
            default: icoHTML = '';
        }
        if (sub) {
            icoHTML += '<span class="ico sub"></span>';
        }
        return icoHTML;
    }
}

function getChatterList() {
    var tableContent = '';
    db.queryURL(chatURL, function (err, data) {
        if (err || data === null) { return '<p>No data</p>'; }
        var chatters = data.chatlines_chatters.splice(0, 15);
        for (var index = 0; index < chatters.length; index++) {
            var element = chatters[index];
            tableContent += '<tr>';
            tableContent += '<td>' + index + '.</td>';
            tableContent += '<td>' + element.key + '</td>';
            tableContent += '<td>' + element.amount + '</td>';
            tableContent += '</tr>';
        }
        console.log(tableContent);
        return tableContent;
    });
}

function getEmoteName(id) {
    db.queryURL(emoteURL, function (err, data) {
        if (err) { return ''; }
        return data.name;
    });
}

function getEmoteList() {
    var tableContent = '';
    db.queryURL(emoteURL, function (err, data) {
        if (err || data === null) { return '<p>No data</p>'; }
        var emotes = data.emotes_twitch.splice(0, 15);
        for (var index = 0; index < emotes.length; index++) {
            var element = emotes[index];
            var emoteName = getEmoteName(element.key);
            tableContent += '<tr>';
            tableContent += '<td>' + index + '.</td>';
            tableContent += '<td><i src="https://static-cdn.jtvnw.net/emoticons/v1/' + element.key + '/1.0" alt="' + emoteName + '">' + emoteName + '</td>';
            tableContent += '<td>' + element.amount + '</td>';
            tableContent += '</tr>';
        }
        console.log(tableContent);
        return tableContent;
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    userName = req.params.userName;
    res.render('channelstats', { title: 'Channel Statistik', chatterList: getChatterList(), emoteList: getEmoteList() });
});

module.exports = router;