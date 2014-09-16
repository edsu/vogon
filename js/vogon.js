/*
 * Vogon Poetry: Use Google Suggest to generate a "poem".
 *
 */

var phrasesSeen = [];

function writePoem(seed) {
  phrasesSeen = [];
  $("#poem").empty();
  getLine(seed);
}

function writeLine(data) {
  // sort suggestions by their length, and get the longest one
  var phrases = data[1];
  phrases.sort(function(a, b) {
    aLen = a.split(" ").length;
    bLen = b.split(" ").length;
    if (aLen > bLen) {
      return 1;
    } else if (aLen < bLen) {
      return -1;
    } else {
      return 0;
    }
  });
  if (phrases.length === 0) {
    return;
  }
  var phrase = phrases.pop();
  phrase = phrase.replace(RegExp(data[0] + ' '), '');

  var words = phrase.split(' ');
  remove(words, 'lyrics'); 
  remove(words, 'mp3'); 
  phrase = words.join(' ');

  if (phrasesSeen.indexOf(phrase) > -1) {
    return;
  }
  phrasesSeen.push(phrase);

  var line = $('<div class="line">' + phrase + "</div>").hide();
  $("#poem").append(line);
  line.fadeIn();
  if (phrasesSeen.length % 4 === 0) {
    $("#poem").append("<br>"); 
  }

  if (words.length > 1) {
    i = Math.floor(Math.random() * words.length);
    j = Math.floor(Math.random() * (words.length - i)) + 1;
    var q = words.slice(i, i + j).join(' ');
    setTimeout('getLine("' + q + '")', 100);
  }
}

function getLine(q) {
  console.log("looking up: " + q);
  var url = 'http://google.com/complete/search?client=chrome&callback=?&q=' + q;
  $.ajax({
    url: url,
    jsonpCallback: 'writeLine',
    dataType: 'jsonp',
    contentType: 'application/json'
  });
}

function remove(a, s) {
  var i = a.indexOf(s);
  if (i > -1) {
    a.splice(i, 1);
  }
}


