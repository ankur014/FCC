var strictMode = false;
var soundPaths = ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"];
var sounds = [];
var sequence;
var winLength = 20;
var curLength;
var gap = [1200, 1000, 800, 600, 600];
var bgColor = ["#9F0F17", "#00A74A", "#CCA707", "#094A8F"];
var glowColor = ["#ff4c4c", "#13ff7c", "#fed93f", "#1c8cff"];

$(document).ready(function() {
	for (var i = 0; i < 4; i++) {
		sounds.push(new Audio(soundPaths[i]));
	}
	$(".alert").hide();
});

function toggleStrict() {
	var btn = $(".strict");

	if (btn.hasClass("btn-default")) {
		btn.removeClass("btn-default");
		btn.addClass("btn-danger");
		strictMode = true;
	} else {
		btn.removeClass("btn-danger");
		btn.addClass("btn-default");
		strictMode = false;
	}
}

function move(elt) {
	$(".alert").hide();
	var id = parseInt(elt.id);
	$(".c" + id).css("background-color", glowColor[id - 1]);
	sounds[id - 1].play();
}

function off(elt) {
	var id = parseInt(elt.id);
	$(".c" + id).css("background-color", bgColor[id - 1]);
	if (curLength === undefined) return;
	if (id !== sequence[curLength]) {
		curLength = 0;
		if (strictMode) {
			var len = sequence.length;
			sequence = [];
			for (var i = 0; i < len; i++) {
				sequence.push(Math.floor(Math.random() * 4) + 1);
			}
		}
		$(".alert").addClass("alert-danger");
		$(".alert").html("<b>Wrong entry :( Try again !</b>");
		$(".alert").show();
		setTimeout(function() {
			$(".alert").fadeOut();
			$(".alert").removeClass("alert-danger");
			glow();
		}, 1500);
	} else {
		curLength++;
		if (curLength === winLength) {
			$(".alert").addClass("alert-success");
			$(".alert").html("<b>Hooray :D You won !</b>");
			$(".alert").show();
			setTimeout(function() {
				$(".alert").fadeOut();
				$(".alert").removeClass("alert-success");
				playGame();
			}, 1500);
		} else if (curLength === sequence.length) {
			curLength = 0;
			var id = Math.floor(Math.random() * 4) + 1;
			sequence.push(id);
			$("#length").text(sequence.length);
			//console.log(sequence);
			glow();
		}
	}
}

function playGame() {
	curLength = 0;
	sequence = [];
	for (var i = 0; i < 1; i++) {
		sequence.push(Math.floor(Math.random() * 4) + 1);
	}
	//console.log(sequence);
	$("#length").text(sequence.length);
	glow();
}

function glow() {
	var waitTime = gap[Math.ceil(sequence.length / 4) - 1];
	var ctr = 0;
	var intervalId = setInterval(function() {
		$(".c" + sequence[ctr]).css("background-color", glowColor[sequence[ctr] - 1]);
		sounds[sequence[ctr] - 1].play();
		setTimeout(function() {
			$(".c" + sequence[ctr]).css("background-color", bgColor[sequence[ctr] - 1]);
			ctr++;
			if (ctr === sequence.length) clearInterval(intervalId);
		}, waitTime / 2);
	}, waitTime);
}


