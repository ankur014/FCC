var url = "http://www.freecodecamp.com/news/hot";
var data;
var numberOfArticles;
var articleData;
var fetchTime;
var curMap;
$(document).ready(function() {
	$(".all").on("click", displayData);
	$("#sortRecent").on("click", function() {
		sortArticles(0);
	});
	$("#sortUpvotes").on("click", function() {
		sortArticles(1);
	});
	$(".searchQuery").on("input", search);

	var jsonCalled = false;
	var waitId = setInterval(function() {
		if (jsonCalled === false) {
			$.getJSON(url, function(json) {
				data = json;
			})
			jsonCalled = true;
		}
		if (data !== undefined) {
			//console.log(JSON.stringify(data));
			numberOfArticles = data.length;
			fetchTime = (new Date()).getTime();
			extractData();
			clearInterval(waitId);
		}
	}, 1000);
});

function sortArticles(flag) {
	var field, id;
	flag === 0 ? field = "timePosted" : field = "upvotes";
	var temp = [];
	var x, y;
	for (var i = 0; i < numberOfArticles; i++) {
		if (curMap[i] === -1) continue;
		x = [];
		y = [];
		id = curMap[i];
		y.push(i);
		y.push(articleData[i][1]);
		x.push(y);
		x.push(articleData[i][1][field]);
		temp.push(x);
	}
	console.log(temp.length);
	temp.sort(function(a, b) {
		return b[1] - a[1];
	});
	var ctr = 0;
	$(".contentBox").text("");
	for (var i = 0; i < temp.length; i++) {
		curMap[temp[i][0][0]] = ctr;
		article = temp[i][0][1];
		time = fetchTime - article.timePosted;
		time = convert(time);
		str = '<div class="row n' + ctr + '"><div class="col-md-1 dpAdjust"><img alt="dp" class="img img-responsive img-circle" src="';
		str += article.picture + '">';
		str += '</div><div class="col-md-11"><div class="ruler"></div><div class="panel panel-info"><div class="panel-heading"><h3 class="panel-title"><a target="_blank" href="';
		str += article.link + '">';
		str += article.headline + '</a></h3></div><div class="panel-body">';
		str += 'Posted: ' + time + ' <span class="glyphicon glyphicon-pencil"></span><a href="http://www.freecodecamp.com/' + article.author + '" target="_blank"><code>@' + article.author + '</code></a>';
		str += ' <span class="has-error"><span class="glyphicon glyphicon-heart control-label" aria-hidden="true"></span></span> ' + article.upvotes + ' ';
		str += '</div></div></div></div>';
		$(".contentBox").append(str);
		ctr++;
	}
}

function search() {
	var query = $(".searchQuery").val();
	query = query.toLowerCase();
	$(".contentBox").text("");
	//console.log(query);
	for (var i = 0; i < numberOfArticles; i++) {
		curMap[i] = -1;
	}
	var ctr = 0;
	for (var i = 0; i < numberOfArticles; i++) {
		if (articleData[i][1]["headline"].toLowerCase().search(query) !== -1 || articleData[i][1]["author"].toLowerCase().search(query) !== -1) {
			curMap[i] = ctr;
			article = articleData[i][1];
			time = fetchTime - article.timePosted;
			time = convert(time);
			str = '<div class="row n' + ctr + '"><div class="col-md-1 dpAdjust"><img alt="dp" class="img img-responsive img-circle" src="';
			str += article.picture + '">';
			str += '</div><div class="col-md-11"><div class="ruler"></div><div class="panel panel-info"><div class="panel-heading"><h3 class="panel-title"><a target="_blank" href="';
			str += article.link + '">';
			str += article.headline + '</a></h3></div><div class="panel-body">';
			str += 'Posted: ' + time + ' <span class="glyphicon glyphicon-pencil"></span><a href="http://www.freecodecamp.com/' + article.author + '" target="_blank"><code>@' + article.author + '</code></a>';
			str += ' <span class="has-error"><span class="glyphicon glyphicon-heart control-label" aria-hidden="true"></span></span> ' + article.upvotes + ' ';
			str += '</div></div></div></div>';
			$(".contentBox").append(str);
			ctr++;
		}
	}
}

function convert(time) {
	var n = time / (24 * 60 * 60 * 1000);
	if (n > 1) return Math.round(n) + " days ago";
	n = n * 24;
	if (n > 1) return Math.round(n) + " hours ago";
	n = n * 60;
	if (n > 1) return Math.round(n) + " minutes ago";
	n = n * 60;
	if (n > 1) return Math.round(n) + " seconds ago";
	n = n * 60;
	return n + " milliseconds ago";

}

function extractData() {
	var article, x;
	articleData = [];
	for (var i = 0; i < numberOfArticles; i++) {
		article = {};
		article["headline"] = data[i]["headline"];
		article["link"] = data[i]["link"];
		article["timePosted"] = data[i]["timePosted"];
		article["upvotes"] = data[i]["rank"];
		article["author"] = data[i]["author"]["username"];
		article["picture"] = data[i]["author"]["picture"];
		article["image"] = data[i]["image"];
		x = [];
		x.push(article.timePosted);
		x.push(article);
		articleData.push(x);
	}

	articleData.sort(function(a, b) {
		return b[0] - a[0];
	})
	displayData();
}

function displayData() {
	var time, str, article;
	curMap = {};
	$(".contentBox").text("");
	for (var i = 0; i < numberOfArticles; i++) {
		article = articleData[i][1];
		curMap[i] = i;
		time = fetchTime - article.timePosted;
		time = convert(time);
		str = '<div class="row n' + i + '"><div class="col-md-1 dpAdjust"><img alt="dp" class="img img-responsive img-circle" src="';
		str += article.picture + '">';
		str += '</div><div class="col-md-11"><div class="ruler"></div><div class="panel panel-info"><div class="panel-heading"><h3 class="panel-title"><a target="_blank" href="';
		str += article.link + '">';
		str += article.headline + '</a></h3></div><div class="panel-body">';
		str += 'Posted: ' + time + ' <span class="glyphicon glyphicon-pencil"></span><a href="http://www.freecodecamp.com/' + article.author + '" target="_blank"><code>@' + article.author + '</code></a>';
		str += ' <span class="has-error"><span class="glyphicon glyphicon-heart control-label" aria-hidden="true"></span></span> ' + article.upvotes + ' ';
		str += '</div></div></div></div>';
		$(".contentBox").append(str);
	}
}