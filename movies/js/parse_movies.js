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




async function LoadZippedFile(){
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
	.then(function success(json) {                    // 5) display the result
		//console.log(text)
		//localStorage.setItem('basicinfo', text);
		console.log("Fetched file");
		
		// alert("Size of sample is: " + json.length);
		// var compressed = LZString.compressToUTF16(json);
		// alert("Size of compressed sample is: " + compressed.length);
		// console.log(compressed)
		
		// json = JSONH.stringify(json).replace(
			// /\u2028|\u2029/g,
			// function (m) {
				// return "\\u202" + (m === "\u2028" ? "8" : "9");
			// })
		localStorage.setItem('JSON', json);
	}, function error(e) {
		console.log(e)
	});
}






function ParseJson(parsed){
	var retrievedObject = localStorage.getItem('JSON');
	parsed = JSON.parse(retrievedObject);
	return parsed;
}

  // {
	// "Title": "An awesome title",
	// "Year": "1999",
	// "Actors": "Georgie Samosa, Frank Furter, Elepha Nt Eyzcream",
	// "Genre": "Comedy, Stupidity"
  // }
  
async function SearchFor(obj, query) {
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
		"Actors",
		"Genre"
	  ]
	};
	var fuse = new Fuse(obj, options); // "list" is the item array
	var results = fuse.search(query);
	Display(results);
}

function FetchJSON(imdbID){
	console.log('db/ind/' + imdbID + ".json")
	return fetch('db/ind/' + imdbID + '.json')       // 1) fetch the url
		.then(response => {
			if (!response.ok) {
                throw new Error("Failed with HTTP code " + response.status);
            }
			console.log(response.json);
			return response.json;
		})
		// .then(data => {
			// json = data.json;
		// })
		.catch(err => {
			console.log("Error: " + err);
		})
}

async function Display(results){
	var poster = document.getElementById("poster");
	var title = document.getElementById("title");
	var plot = document.getElementById("plot");
	var info = document.getElementById("info");
	var rating = document.getElementById("rating");
	var trailer = document.getElementById("trailer");
	var watchlist = document.getElementById("watchlist");
	var stars = document.getElementById("stars");
	var reviewinfo = document.getElementById("reviewinfo");
	var navbar = document.getElementById("navbar"); //#navbar is the column above the movietitle, but below the searchbar. It says Buttons go here--------...-----thats right
	var searchbar = document.getElementById("real_searchbar");
	
	var data = results[0];
	
	var middot = ' &middot; ';
	
	
	navbar.innerText = results.length + " results found."
	
	fetch('db/ind/' + imdbID + ".json")
	.then(res => {
		if (!response.ok) {
                throw new Error("Failed with HTTP code " + response.status);
        }
		return res.json()
	})
	.then(json => {
		console.log(json)
		poster.src = data.Poster;
		title.innerText = data.Title;
		plot.innerText = data.Plot;
		
		var infoHtml = data.Year + middot + data.Runtime + middot + '<span class="boxed">' + data.Rated + '</span>';
		info.innerHTML = infoHtml; //  1992 . 123min . PG
		
		var ratingHtml = 'IMDb ' + data.imdbRating + middot + data.Genre;
		rating.innerHTML = ratingHtml;
	})
	.catch(err => {
		console.log("Error: " + err);
	})
	
	
	
	console.log(results);
}
















