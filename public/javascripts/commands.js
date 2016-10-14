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

function getIcon(group) {
    var icoHTML = '';
    switch (group) {
        case '3':
            icoHTML += '<span class="ico sub"></span>';
            break;
        case '2':
            icoHTML += '<span class="ico mod"></span>';
            break;
        case ('1' || '0'):
            icoHTML += '<span class="ico broad"></span><span class="ico staff"></span>';
            break;
        default: icoHTML = 'Viewer';
    }
    return icoHTML;
}

function populateTable() {

    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/api/v1/commands/7/', function( data ) {        
        $.each(data.commandlist, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + data.commandprefix + this.command.name + '</td>';
            tableContent += '<td>' + this.command.response + '</td>';
            tableContent += '<td>' + getIcon(this.command.permission) + '</td>';
            tableContent += '<td>' + this.command.cooldown + 's</td>';
            tableContent += '<td>' + this.command.price + '</td>';
            tableContent += '</tr>';            
        });

        $('#commandList table tbody').html(tableContent);
    });
};