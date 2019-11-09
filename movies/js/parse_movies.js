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
	bigmovie.currentmovieid = results[0].imdbID;
	navbar.navbar = results.length + " results found."
	
	fetch('db/ind/' + results[0].imdbID + ".json")
		.then(res => {
			if (!res.ok) {
					throw new Error("Failed with HTTP code " + response.status);
			}
			return res.json()
		})
		.then(data => {
			bigmovie.poster = data.Poster;
			bigmovie.title = data.Title;
			bigmovie.plot = data.Plot;
			bigmovie.year = data.Year;
			bigmovie.runtime = data.Runtime;
			bigmovie.rating = data.imdbRating;
			bigmovie.age = data.Rated;
			bigmovie.genres = data.Genre;
		})
		.catch(err => {
			console.log("Error: " + err);
		})
	
	results.splice(0,1);
	resultLength = 20;
	if(results.length < 20) {
		resultLength = results.length 
	}
	
	var switchCount = 0;
	var smallMovieContainer = document.getElementById("parentMovie");
	smallMovieContainer.innerHTML = "";

	for(index = 0; index < resultLength; index++){
		var data = await fetch('db/ind/' + results[index].imdbID + ".json")
			.then(res => {
				if (!res.ok) {
						throw new Error("Failed with HTTP code " + response.status);
				}
				return res.json()
			})
			.catch(err => {
				console.log("Error: " + err);
			})

		
		var imgurl = data.Poster;
		if(imgurl == "N/A"){
			imgurl = "images/unknown.png"
		}
		var title = data.Title;
		var agerating = data.Rated;
		var released = data.Year;
		var imdbrating = data.imdbRating;
		var genres = data.Genre.replace(" ", "&nbsp;").split(",");
		genres.length = 2;
		genres.toString();
		
		var childMovie = '<div id="childMovie" class="tile is-child is-2"><div class="smallmovie"><ul><div class="card"><li><div style="height:17em"><img class="poster-little" src="' + imgurl + '" /></div></li><li><p class="caption">' + title + '<br><span class="movieinfo"><span class="boxed">' + agerating + '</span> &middot; ' + released + ' &middot;&nbsp;' + imdbrating + '</span><br><span class="movieinfo"><span>' + genres + '</span></span></p></li></div></ul></div></div>';
		
		smallMovieContainer.insertAdjacentHTML('beforeend', childMovie);
		switchCount = switchCount + 1;
	}
	
}

async function GetTrailer(id){
	apikey = "8ca85a295652c75508670fd4aa6907ce";
	url = "https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=" + apikey +"&language=en-US&external_source=imdb_id";

	var trailerjson = await fetch(url)
		.then(res => {
			if (!res.ok) {
					throw new Error("Failed with HTTP code " + response.status);
			}
			return res.json()
		})
		.catch(err => {
			console.log("Error: " + err);
		})

	for(item of trailerjson.results){
		if(item.site == "YouTube"){
			if(item.type == "Trailer"){
				return "https://www.youtube-nocookie.com/embed/" + item.key + "?autoplay=1&rel=0&showinfo=0";
			}
		}
	}

	return false;
}

//