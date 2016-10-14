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

function displayUser(user) {
    var userContent = '';    

    $.getJSON('/userstats/' + user, function (data) {
        if (data.userdetails.length > 0) {            
            userContent += '<li>Name: ' + data.userdetails[0].user.name + '</li>';
            userContent += '<li>Usergroup: ' + data.userdetails[0].user.group + '</li>';
            userContent += '<li>Subscriber: ' + data.userdetails[0].user.subscribed + '</li>';
            userContent += '<li>Schokiplatzierung: ' + data.userdetails[0].user.rank + '</li>';
            userContent += '<li>Benutzerrrang: ' + data.userdetails[0].user.customrank + '</li>';
            userContent += '<li>Brawlwins: ' + data.userdetails[0].user.brawlwins + '</li>';
            userContent += '<li>zuletzt online: ' + data.userdetails[0].user.lastseen + '</li>';
            userContent += '<li>Zeit im Chat: ' + data.userdetails[0].user.time + '</li>';
            $('#userstats ul').html(userContent);
        }
        else {
            userContent = "<li>Name nicht gefunden :(</li>";
            $('#userstats ul').html(userContent);
        }
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

function populateTable() {

    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/0/30', function( data ) {        
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