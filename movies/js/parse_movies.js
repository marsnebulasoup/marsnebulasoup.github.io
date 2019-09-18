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


function SearchFor(query) {
	var result = fuse.search(query);
	console.log(result);
}

console.log("this is it");
LoadFile();
var parsed = ParseJson();
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
var fuse = new Fuse(parsed, options);
console.log(fuse.search("apple"));


