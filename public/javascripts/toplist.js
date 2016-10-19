var userListData = [];

$(document).ready(function() {
    populateTable();

    $("button#searchbutton").click(function() {
      var user = $('input#username').val();
        if (!user) {
            //error
        }
        else{
            displayUser(user);
        }
    });
});

// functions 

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

function displayUser(user) {
    var userContent = '';    

    $.getJSON('/api/v1/userstats/' + user, function (data) {
        if (data.userdetails.length > 0) {            
            userContent += '<tr><td>Name</td><td>' + data.userdetails[0].user.name + '</td></tr>';
            userContent += '<tr><td>Usergroup</td><td>' + data.userdetails[0].user.group + '</td></tr>';
            userContent += '<tr><td>Subscriber</td><td>' + data.userdetails[0].user.subscribed + '</td></tr>';
            userContent += '<tr><td>Schokiplatzierung</td><td>' + data.userdetails[0].user.rank + '</td></tr>';
            userContent += '<tr><td>Benutzerrrang</td><td>' + data.userdetails[0].user.customrank + '</td></tr>';
            userContent += '<tr><td>Brawlwins</td><td>' + data.userdetails[0].user.brawlwins + '</td></tr>';
            userContent += '<tr><td>zuletzt online</td><td>' + data.userdetails[0].user.lastseen + '</td></tr>';
            userContent += '<tr><td>Zeit im Chat</td><td>' + data.userdetails[0].user.time + '</td></tr>';
            $('#userStats table tbody').html(userContent);
        }
        else {
            userContent = "<tr><td>Name nicht gefunden :(</td></tr>";
            $('#userStats table tbody').html(userContent);
        }
    });
}

function populateTable() {

    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/api/v1/users/0/30', function( data ) {        
        $.each(data.rankedpointslist, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.user.rank + '</td>';
            tableContent += '<td>' + getIcon(this.user.name, this.user.group, this.user.subscribed) + '<a href="#" id="linkshowuser" rel="' + this.user.name + '">' + this.user.name + '</a></td>';
            tableContent += '<td>' + this.user.points + '</td>';
            tableContent += '</tr>';            
        });

        $('#userList table tbody').html(tableContent);

        $("a#linkshowuser").click(function () {
            var user = $(this).attr('rel');
            if (!user) {
                //error
            }
            else {
                displayUser(user);
            }
        });
    });
};