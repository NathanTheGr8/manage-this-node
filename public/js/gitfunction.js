
// Event Handler for show/hide changelog
$('#showChangelog').click(function () {
    $('#changelogContainer').slideToggle(1000);
    viewChangelog();
    if ($(this).html() == "<span class=\"fa fa-github\"></span> Show Updates")
        $(this).html('<span class=\"fa fa-github\"></span> Hide Updates');
    else
        $(this).html('<span class=\"fa fa-github\"></span> Show Updates');
});

// Takes all the data we have to generate our changelog
function viewChangelog() {
    var output = "";

    var json = $('#gitData').data();
    var status = "<strong>up to date!</strong>";
    if (dataStore().differenceCommits < 0) {
        status = "<strong>" + dataStore().differenceCommits + " commits ahead!</strong>";
    }
    if (dataStore().differenceCommits > 0) {
        status = "<strong>" + dataStore().differenceCommits + " commits behind!</strong>";
    }
    if (!(dataStore().gitDirectory == "readable") && (dataStore().localVersion == "unknown")) {
        status = "running an <strong>unknown version</strong>.<br/>We can read the <code>.git</directory> to see what version you are using, but we were unable to find the <code>git</code> command.";
    }
    if (dataStore().localVersion == "noexec") {
        status = "not allowing Muximux to run the <code>git</code> command to check what version you're on.<br/>Either you can set <code>safe_mode_exec_dir " + dataStore().cwd + "</code>, <strong>or</strong> you can set <code>safe_mode = off</code> inside your <code>" + dataStore().phpini + "</code> file.";
    }
    if (!(dataStore().gitDirectory == "readable") && (dataStore().localVersion == "noexec")) {
        status += "<br>Also, the <code>" + dataStore().cwd + "/.git/</code> directory is not readable. Please make sure that the directory can be read by your webserver.";
    }
    output = "<p>Your install is currently " + status + "<br/>";
    if (dataStore().differenceCommits > 0) {
        output += "The changes from your version to the latest version can be read <a href=\"" + dataStore().compareURL + "\" target=\"_blank\">here</a>.</p>";
    }
    output += "<p>The latest update to <a href='https://github.com/mescon/Muximux/' target='_blank'>Muximux</a> was uploaded to Github " + dataStore().differenceDays + " days ago.</p>";
    output += "<p>If you want to update, please do <code>git pull</code> in your terminal, or <a href='https://github.com/mescon/Muximux/archive/master.zip' target='_blank'>download the latest zip.</a></p><br/><h3>Changelog ("+ dataStore().branch +")</h3><ul>";
    for (var i in json) {
        var shortCommitID = json[i].sha.substring(0, 7);
        var shortComments = htmlEntities(json[i].commit.message.substring(0, 550).replace(/$/, "") + "...");
        var shortDate = json[i].commit.author.date.substring(0, 10);
        output += "<li><pre>" + shortDate + " <a href=\"" + json[i].html_url + "\">" + shortCommitID + "</a>:  " + shortComments + "</li></pre>";
    }
    output += "</ul>";
    $('#changelog').html(output);
}

// Gets the current branch the user tracks. This is then appended to Github API calls.
function getBranch() {
    $.ajax({
        async: false,
        dataType: 'text',
        url: "muximux.php?get=branch",
        type: 'GET',
        success: function (data) {
            $('#branch').data({data: data});
        }
    });
}

// Grabs Muximux repo data from github api
function getGitHubData() {
    var branch = $("#branch").data()['data'];
    $.ajax({
        async: false,
        dataType: 'json',
        url: "https://api.github.com/repos/mescon/Muximux/commits?sha=" + branch,
        type: 'GET',
        success: function (data) {
            $('#gitData').data(data);
        }

    });
}

// Grabs data from ajax calls that were stored on elements for later use
function dataStore() {
    var json = $('#gitData').data();
    var localversion = $("#hash-data").data()['data'];
    var cwd = $("#cwd-data").data()['data'];
    var phpini = $("#phpini-data").data()['data'];
    var secret = $("#secret").data()['data'];
    var gitdir = $("#gitdirectory-data").data()['data'];
    var branch = $("#branch").data()['data'];
    var title  = $("#title-data").data()['data'];
    var compareURL = "https://github.com/mescon/Muximux/compare/" + localversion + "..." + json[0].sha;
    var difference = 0;
    for (var i in json) {
        if (json[i].sha == localversion) {
            difference = i;
        }
    }
    var differenceDays = datediff(json[0].commit.author.date.substring(0, 10));

    var upstreamInformation = {
        compareURL: compareURL,
        differenceCommits: difference,
        differenceDays: differenceDays,
        latestVersion: json[0].sha,
        localVersion: localversion,
        gitDirectory: gitdir,
        cwd: cwd,
        phpini: phpini,
        secret: secret,
        branch: branch,
        title: title
    };
    return upstreamInformation;
}