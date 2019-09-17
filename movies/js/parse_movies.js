//Parses the movies.json file

function LoadFile() {
	var response = "";
	var req = new XMLHttpRequest();
	req.overrideMimeType("application/json");
	req.open('GET', 'db/movies.json', true);
	req.onload  = function() {
	   response = req.responseText;
	   localStorage.setItem('JSON', JSON.stringify(response));

	};
	req.send(null);
	
}


function ParseJson(parsed){
	var retrievedObject = localStorage.getItem('JSON');
	parsed = JSON.parse(retrievedObject);
	console.log(parsed);
	searchFor(parsed, "Miss")
}


function searchFor(obj, query) {
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
	var result = fuse.search("Miss");
	console.log(result);
}

console.log("this is it");
LoadFile();
ParseJson();