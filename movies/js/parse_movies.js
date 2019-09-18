//Parses the movies.json file

function LoadFile() {
	var response = "";
	var req = new XMLHttpRequest();
	req.overrideMimeType("application/json");
	req.open('GET', 'db/movies.json', true);
	req.onload  = function() {
	   response = req.responseText;
	   localStorage.setItem('JSON', response);
		};
	req.send(null);
	
}


function ParseJson(parsed){
	var retrievedObject = localStorage.getItem('JSON');
	parsed = JSON.parse(retrievedObject);
	return parsed;
}


function SearchFor(obj, query) {
  var options = {
	  shouldSort: true,
	  threshold: 0.6,
	  location: 0,
	  distance: 100,
	  maxPatternLength: 32,
	  minMatchCharLength: 1,
	  keys: [
		"Title"
	  ]
	};
	var fuse = new Fuse(obj, options); // "list" is the item array
	var result = fuse.search(query);
	console.log(result);
}

console.log("this is it");
LoadFile();

var t0 = performance.now();

SearchFor(ParseJson(); , "apple");
var t1 = performance.now();
console.log("Call to SearchFor('apple') took " + (t1 - t0) + " milliseconds.");

