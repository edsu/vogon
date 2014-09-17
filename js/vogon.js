/*
 * Vogon Poetry: Use Google Suggest to generate a "poem".
 *
 */


var linesSeen = [];
var verbProbability = 0.6;
var maxLines = 16;
var stanza = null;

function writePoem(seed) {
  linesSeen = [];
  $("#stanzas").empty();
  getLine(seed);
  window.location.hash = seed;
}

function writeLine(data) {
  // sort suggestions by their length, and get the longest one
  var phrases = data[1];

  console.log("got google suggestions: ", phrases);
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
    console.log("no suggestions");
    var words = data[0].split(" ");
    if (words.length > 1) {
      getLine(words[1]);
    }
    return;
  }

  var line = phrases.pop();
  console.log("picked longest suggestion", line);

  line = line.replace(RegExp(data[0] + ' '), '');
  console.log("removed seed text", line);

  // sometimes add a verb
  if (Math.random() > verbProbability) {
    line = verb() + " " + line;
    console.log("prepended a random verb", line);
  }

  // remove some things
  var words = line.split(' ');
  remove(words, 'lyrics'); 
  remove(words, 'mp3'); 
  line = words.join(' ');

  if (! stanza || linesSeen.length % 2 === 0) {
    if (stanza) {
      addTweetButton(stanza);
      twttr.widgets.load();
    }
    console.log("creating new stanza");
    stanza = $('<p class="stanza"></p>');
    stanza.hover(displayShare, hideShare);
    $("#stanzas").append(stanza);
  }

  line = $('<div class="line">' + line + "</div>").hide();
  stanza.append(line);
  line.fadeIn();
  linesSeen.push(line);

  if (linesSeen.length >= maxLines) {
    console.log("stopping after writing", maxLines);
    addTweetButton(stanza);
    return;
  } else if (words.length > 1) {
    i = Math.floor(Math.random() * (words.length - 2)) + 1;
    var q = words.slice(i, i + 2).join(' ');
    setTimeout('getLine("' + q + '")', 700);
    console.log("picked new suggestion seed", q);
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

function addTweetButton(stanza) {
  var lines = [];
  $(stanza).children().each(function (i, o) {
    lines.push($(o).text());
  });
  var text = lines.join(" / ") + " #vogonpoetry";
  stanza.append($('<a class="twitter-share-button" data-count="none" data-text="' + text + '" href="https://twitter.com/share">Tweet</a>'));
}

function displayShare() {
  $(this).find(".twitter-share-button").show();
}

function hideShare() {
  $(this).find(".twitter-share-button").hide();
}

