var userListData = [];

$(document).ready(function() {
    populateTables();
});

// functions 

function getUserName(user) {
    var userContent = '';    

    $.getJSON('/api/v1/userstats/' + user, function (data) {
        if (data.userdetails.length > 0) {
            userContent += getIcon(user,data.userdetails[0].user.group, data.userdetails[0].subscribed);
        }
        userContent += user;
        return userContent;
    });
}

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

function populateTables() {

    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('https://twitchstats.io/api/channel/germandota/initial/', function (data) {
        var i = 0;
        $.each(data.chatlines_chatters.splice(0, 15), function () {
            tableContent += '<tr>';
            tableContent += '<td>' + i + '.</td>';
            tableContent += '<td>' + getIcon(this.user.name, this.user.group, this.user.subscribed) + getUserName(this.key) + '</a></td>';
            tableContent += '<td>' + this.amount + '</td>';
            tableContent += '</tr>';
            i++;
        });
        $('#chatList table tbody').html(tableContent);

        tableContent = '';
        i = 0;
        $.each(data.emotes_twitch.splice(0, 15), function () {
            var emote = this;
            $.getJSON('https://twitchstats.io/api/emote/' + emote.key, function (data) {
                tableContent += '<tr>';
                tableContent += '<td>' + i + '.</td>';
                tableContent += '<td><i src="https://static-cdn.jtvnw.net/emoticons/v1/' + emote.key + '/1.0" alt="' + data.name + '">' + data.name + '</td>';
                tableContent += '<td>' + emote.amount + '</td>';
                tableContent += '</tr>';
                i++;
            });
            $('#emoteList table tbody').html(tableContent);
        });
    });
}