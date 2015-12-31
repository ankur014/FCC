var users = ["freecodecamp", "brunofin", "storbeck", "medrybw", "comster404", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff"];
var url = "https://api.twitch.tv/kraken/";
var cid = "?client_id=tufcbt17fw9fryzdhsltwuydm24gt9b&callback=?";
var idMap = {};
var test = ["medrybw"];
$(document).ready(function() {
	$(".all").on("click", function() { handle(0); });
	$(".online").on("click", function() { handle(1); });
	$(".offline").on("click", function() { handle(2); });
	$("#queryText").on("input", function() {
		var val = $("#queryText").val();
		var name;
		for (var i = 0; i < users.length; i++) {
			name = users[i].toLowerCase();
			if (name.search(val) !== -1) {
				$("#s" + idMap[users[i]]).show();
			} else {
				$("#s" + idMap[users[i]]).hide();
			}
		}
	});
	updateInfo(users);
	var wait = setInterval(function() {
		if (Object.keys(idMap).length === users.length) {
			checkLive(users);
			clearInterval(wait);
		}
	}, 1000);
});

function checkLive(users) {
	var cur;
	users.forEach(function(user) {
		$.getJSON(url + "streams/" + user + "?callback=?", function(json) {
			console.log(JSON.stringify(json));
			var add = {};
			cur = "#desc" + idMap[user];
		  	if(json.status === 422) {
		  		add.closed = true;
		  		$(cur).html('<span class="label label-danger"><strong>offline</strong></span> <span class="label label-info">Account Closed</span>');
		  	} else {
		  		if (json.stream === null) {
		  			add.offline = true;
		  			$(cur).html('<span class="label label-danger"><strong>offline</strong></span>');
		  		} else {
		  			add.status = json.stream.channel.status;
		  			//console.log(user, idMap[user], cur);
		  			if (add.status.length > 25) {
		  				add.status = add.status.substr(0, 25) + "...";
		  			}
		  			$(cur).html('<span class="label label-success"><strong>online</strong></span> <span class="label label-info">' + add.status + '</span>');
		  		}
		  	}
		});
	});
}

function updateInfo(users) {
	var id = 0;
	users.forEach(function(user) {
		$.getJSON(url + "users/" + user + cid, function(json) {
			console.log(JSON.stringify(json));
			var add = {};
		  	add.name = json.display_name;
		  	add.bio = json.bio;
		  	add.logo = json.logo;
		  	add.channel = json.name;
		  	add.id = user;
		  	//console.log(add.name, add.bio, add.logo);
			//$("#list").append(add.name + add.bio + add.logo);
			addId(user, id);
			addInfo(add, id++);
		});
	});
}

function addId(user, id) {
	//console.log(user, id);
	idMap[user] = id;
}

function handle(bid) {
	if (bid === 0) {
		for (var i = 0; i < users.length; i++) {
			$("#s" + i).show();
		}
	} else {
		var str;
		for (var i = 0; i < users.length; i++) {
			str = $("#desc" + idMap[users[i]]).text();
			console.log(str);
			if (str.length > 0 && str.search("offline") === -1 && str.search("Account Closed") === -1) {
				bid === 1 ? $("#s" + idMap[users[i]]).show() : $("#s" + idMap[users[i]]).hide();
			} else {
				bid === 1 ? $("#s" + idMap[users[i]]).hide() : $("#s" + idMap[users[i]]).show();
			}
		}
	}
}

function addInfo(userData, i) {
	//console.log(userData.name, i);
	var add = "";
	add = '<div class="panel panel-default" id="s'+ i + '""><div class="panel-heading" role="tab" id="heading' + i + '">';
	add += '<h4 class="panel-title"><a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i;
	add += '" aria-expanded="true" aria-controls="collapse' + i + '"><strong>';
	add += userData.name + '</strong> <small id="desc' + i + '"></small></a> ' + '<a href="http://twitch.tv/' + userData.channel + '"<span class="has-success"><span class="glyphicon glyphicon-share-alt pull-right control-label" aria-hidden="true"></span></span></a>' + '</h4></div><div id="collapse' + i;
	add += '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '">';
	add += '<div class="panel-body">';
	add += '<div class="row"><div class="col-md-4">';
	add += '<img alt="displayPic" src="' + userData.logo + '" class="img-responsive img-circle"/></div><div class="col-md-8">';
	if (userData.bio !== null) add += userData.bio;
	else add += 'No bio available.';
	add += '</div></div></div></div></div>';
	$("#accordion").append(add);
}