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

function getChatterList(cb) {
    var tableContent = '';
    db.queryURL(chatURL, function (err, data) {
        if (err || data === null) { cb(err, '<p>No data</p>'); }
        else {
            var chatters = data.chatlines_chatters.splice(0, 15);
            for (var index = 0; index < chatters.length; index++) {
                var element = chatters[index];
                tableContent += '<tr>';
                tableContent += '<td>' + index + '.</td>';
                tableContent += '<td>' + element.key + '</td>';
                tableContent += '<td>' + element.amount + '</td>';
                tableContent += '</tr>';
            }
            cb(null, tableContent);
        }
        console.log(tableContent);
    });
}

function getEmoteList(cb) {
    var tableContent = '';
    db.queryURL(chatURL, function (err, data) {
        if (err || data === null) { cb(err, '<p>No data</p>'); }
        else {
            var emotes = data.emotes_twitch.splice(0, 15);
            for (var index = 0; index < emotes.length; index++) {
                var element = emotes[index];
                var emoteName = element.name;
                tableContent += '<tr>';
                tableContent += '<td>' + index + '.</td>';
                tableContent += '<td><i src="https://static-cdn.jtvnw.net/emoticons/v1/' + element.key + '/1.0" alt="' + emoteName + '">' + emoteName + '</td>';
                tableContent += '<td>' + element.amount + '</td>';
                tableContent += '</tr>';
            }
            cb(null, tableContent);
        }
        console.log(tableContent);
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    userName = req.params.userName;
    getChatterList(function (err, data) {
        var chatList = data;
        getEmoteList(function(err, data){
            var emoteList = data;
            res.render('channelstats', { title: 'Channel Statistik', chatterList: chatList, emoteList: emoteList });
        });
    });    
});

module.exports = router;