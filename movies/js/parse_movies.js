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

function LoadZippedFile(){
	var path = "db/1000popularmovies.zip";
	var filename = "1000popularmovies.json";
	fetch('http://lengthapi.win/movies/' + path)       // 1) fetch the url
	.then(function (response) {                       // 2) filter on 200 OK
		if (response.status === 200 || response.status === 0) {
			return Promise.resolve(response.blob());
		} else {
			return Promise.reject(new Error(response.statusText));
		}
	})
	.then(JSZip.loadAsync)                            // 3) chain with the zip promise
	.then(function (zip) {
		return zip.file(filename).async("string"); // 4) chain with the text content promise
	})
	.then(function success(text) {                    // 5) display the result
		//console.log(text)
		//localStorage.setItem('basicinfo', text);
		console.log("Fetched file");
		localStorage.setItem('JSON', text);
	}, function error(e) {
		console.log(e)
	});
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
		"Title",
		"Year",
		"Director",
		"Actors",
		"Genre"
	  ]
	};
	var fuse = new Fuse(obj, options); // "list" is the item array
	var result = fuse.search(query);
	return result;
}



