//Parses the movies.json file

function LoadFile() {
    var response = "";
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', 'db/movies.json', true);
    req.onload = function () {
        response = req.responseText;
        localStorage.setItem('JSON', response);
    };
    req.send(null);

}




// async function LoadZippedFile() {
// 	var path = "db/1000popularmovies.zip";
// 	var filename = "1000popularmovies.json";
// 	fetch('https://lengthapi.win/movies/' + path)       // 1) fetch the url
// 		.then(function (response) {                       // 2) filter on 200 OK
// 			if (response.status === 200 || response.status === 0) {
// 				return Promise.resolve(response.blob());
// 			} else {
// 				return Promise.reject(new Error(response.statusText));
// 			}
// 		})
// 		.then(JSZip.loadAsync)                            // 3) chain with the zip promise
// 		.then(function (zip) {
// 			return zip.file(filename).async("string"); // 4) chain with the text content promise
// 		})
// 		.then(function success(json) {                    // 5) display the result
// 			//console.log(text)
// 			//localStorage.setItem('basicinfo', text);
// 			console.log("Fetched file");

// 			// alert("Size of sample is: " + json.length);
// 			// var compressed = LZString.compressToUTF16(json);
// 			// alert("Size of compressed sample is: " + compressed.length);
// 			// console.log(compressed)

// 			// json = JSONH.stringify(json).replace(
// 			// /\u2028|\u2029/g,
// 			// function (m) {
// 			// return "\\u202" + (m === "\u2028" ? "8" : "9");
// 			// })
// 			localStorage.setItem('JSON', json);
// 		}, function error(e) {
// 			console.log(e)
// 		});
// }


async function SearchFor(obj, query) {
    Searcher(obj, query).then(r => {
        var results = [];
        r.forEach(movie => results.push(movie.obj));
        overlay.searchedmovies = results;
        overlay.recomputeSearched();
        overlay.searchbarSorter();
    });
}

async function Searcher(obj, query) {
    return fuzzysort.goAsync(query, obj, {
        keys: [
            "Title",
            "Year",
            "Actors",
            "Genre"
        ],
        threshold: -Infinity, // Don't return matches worse than this (higher is faster)
        limit: 25, // Don't return more results than this (lower is faster)
        allowTypo: true, // Allwos a snigle transpoes (false is faster)
    });
}

function FetchJSON(imdbID) {
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

async function Display(results) {
    if (results.length > 0) {
        results = _.uniqBy(results, movie => movie.imdbID); /*there seems to be a bug with fuzzysort; it sometimes returns duplicate
		elements, so this line filters them by imdbID to make sure there aren't any duplicates.*/

        overlay.currentmovieid = results[0].imdbID;
        overlay.navbar = results.length + " results found."

        var data = results[0];
        overlay.poster = data.Poster;
        overlay.title = data.Title;
        overlay.plot = data.Plot;
        overlay.year = data.Year;
        overlay.runtime = data.Runtime;
        overlay.rating = data.imdbRating;
        overlay.age = data.Rated;
        overlay.genres = data.Genre;
        overlay.ratingCount = data.imdbVotes;
        if (!isNaN(Number(data.imdbRating))) {
            var rating = Number(data.imdbRating);
            let half = rating / 2
            overlay.ratingHalf = half.toFixed(1);
            overlay.stars = Number((Math.round(rating / 2 * 4) / 4).toFixed(2));
        }
        else {
            overlay.stars = "N/A";
        }

        therest = results.slice(0)
        therest.splice(0, 1);

        var watchlist = localStorage.getItem("Watchlist");
        if (watchlist != null && watchlist != "[]" && watchlist != "") { //check if there is a watchlist
            var list = JSON.parse(watchlist);
            if (!_.find(list, { 'imdbID': data.imdbID })) {
                document.getElementById('watchlist').classList.remove('is-link');
                overlay.showplus = true;
            }
            else {
                document.getElementById('watchlist').classList.add('is-link');
                overlay.showplus = false;
            }
        }

        var smallMovieContainer = document.getElementById("parentMovie");
        smallMovieContainer.innerHTML = "";

        for (movie of therest) { //data is one movie object
            var data = movie
            var imgurl = data.Poster;
            if (imgurl == "N/A") {
                imgurl = "images/unknown.png"
            }
            var title = data.Title;
            var agerating = data.Rated;
            var released = data.Year;
            var imdbrating = data.imdbRating;
            var genres = data.Genre;
            if (data.Genre.includes(",")) {
                var genres = data.Genre.split(",");
                genres.length = 2;
                genres.toString().replace(" ", "&nbsp;");
            }

            var childMovie = '<div id="childMovie" class="tile is-child is-2"><div class="smallmovie"><ul><div class="card"><li><div style="height:17em"><img class="poster-little" src="' + imgurl + '" /></div></li><li><p class="caption">' + title + '<br><span class="movieinfo"><span class="boxed">' + agerating + '</span> &middot; ' + released + ' &middot;&nbsp;' + imdbrating + '</span><br><span class="movieinfo"><span>' + genres + '</span></span></p></li></div></ul></div></div>';

            smallMovieContainer.insertAdjacentHTML('beforeend', childMovie);
        }
    }
}

async function GetTrailer(id) {
    apikey = "8ca85a295652c75508670fd4aa6907ce";
    url = "https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=" + apikey + "&language=en-US&external_source=imdb_id";

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

    for (item of trailerjson.results) {
        if (item.site == "YouTube") {
            if (item.type == "Trailer") {
                return "https://www.youtube-nocookie.com/embed/" + item.key + "?autoplay=1&rel=0&showinfo=0";
            }
        }
    }

    return false;
}




///////////////
///////////////
//////////// UI.JS
///////////////
///////////////

function TypeAndErase() {

    var first_run = true;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function Type(id, sentence) {
        return new Promise(async function (resolve, reject) {
            var elem = document.getElementById(id);
            for (letter of sentence) {
                if (letter == " ") {
                    letter = "&nbsp;"
                }

                elem.innerHTML += letter;
                await sleep(70);

            }
            if (first_run == false) {
                await sleep(2500);
            }
            resolve();
        });
    }

    async function Delete(id) {
        return new Promise(async function (resolve, reject) {
            var elem = document.getElementById(id);
            var text = elem.innerText;
            for (letter of text) {
                elem.innerText = elem.innerText.substring(0, elem.innerText.length - 1);
                await sleep(70);
            }
            resolve();
        });
    }

    Type("findtheperfect", "Find the perfect").then(
        result => Type("movie/tvshow", "movie").then(
            result => Loop()
        )
    );

    async function Loop() {
        first_run = false;
        await sleep(2500);
        Delete("movie/tvshow").then(
            result => Type("movie/tvshow", "tv show").then(
                result => Delete("movie/tvshow").then(
                    result => Type("movie/tvshow", "movie").then(
                        result => Loop()
                    )
                )
            )
        );
    }

}

function SelectButtons(id) {
    var thebutton = document.getElementById(id);
    var classes = thebutton.classList;
    var totoggle = "mod";
    var totoggleto = "is-link";
    if (classes.contains(totoggle)) {
        classes.remove(totoggle);
        classes.add(totoggleto)
    }

    else {
        classes.remove(totoggleto);
        classes.add(totoggle)
    }




}

function SearchMovies() {
    var input = overlay.query //document.getElementById("real_searchbar").value;
    console.log("From searchmovies(): " + input);
    SearchFor(popularmoviesjson, input);
    //console.log(results)
    //Display(results);
}

function TransformSearch(state) {
    var overlay = document.getElementById("overlay-search");
    //var html = document.getElementById("everything");
    var bogus_searchbar_icon = document.getElementById("bogus-searchbar-icon");
    if (state) {
        overlay.style.display = "block";
        everything.style.overflow = "hidden";
        bogus_searchbar_icon.style.opacity = "0";

    } else {
        overlay.style.display = "none";
        everything.style.overflow = "scroll";
        bogus_searchbar_icon.style.opacity = "1";
    }
}


//Searchbar required functions


function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (overlay.currentFocus >= x.length) overlay.currentFocus = 0;
    if (overlay.currentFocus < 0) overlay.currentFocus = (x.length - 1);
    x[overlay.currentFocus].classList.add("selected");
}

function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("selected");
    }
}


function setFocused() {
    var searchbar = document.getElementById("hints-searchbar");
    var hints = document.getElementById("hints-hints-container");
    if (!searchbar.classList.contains("hints-searchbar-focus")) {
        hints.style.display = "initial";
        searchbar.classList.add("hints-searchbar-focus");
        if (overlay.query == "") {
            PreloadSearchBar();
        }
        else if (overlay.query != "" && document.getElementById("hints-hints").innerHTML == "") {
            /* for some reason if you click on the movie in the searchbar, then open the searchbar again, 
            click on the movie again, and then open the searchbar again, it won't show any search results. 
            this solves the problem by checking if there aren't any results when the searchbar isn't empty 
            and calling the computeAutocomplete function if so*/
            console.log("No results in the searchbar, and the searchbar is not empty. Recomputing searchbar results...");
            computeAutocomplete(overlay.query);
        }
    }
}

function unsetFocused() {
    var searchbar = document.getElementById("hints-searchbar");
    var hints = document.getElementById("hints-hints-container");
    searchbar.classList.remove("hints-searchbar-focus");
    hints.style.display = "none";
}

function reset() {
    GenerateButtons(2);
    SelectDropdown(document.getElementById("sortdefault"), "is-link");
    overlay.searchbarsortvalue = "relevance";
    overlay.searchbarfilter = [[], [], [], [], []];
    SearchMovies();

}

function WatchlistHandler(elem, id, title = "", poster = "") {
    var classes = elem.classList;
    var toggler = "is-link";
    if (!classes.contains(toggler)) { //add
        classes.add(toggler);
        overlay.showplus = false;
        SaveToWatchlist(id, title, poster);
    }
    else { //remove
        classes.remove(toggler);
        overlay.showplus = true;
        RemoveFromWatchlist(id);
    }
}

function OpenWatchlist() {
    console.log("Opening Watchlist...")
    let list = localStorage.getItem("Watchlist");
    //let list = overlay.twentypopularmovies;
    var watchlist_container = document.getElementById('watchlist-overlay');
    if (list != null && list != "[]" && list != "") {
        document.getElementById('watchlist-overlay-container-backbutton').style.display = 'initial';
        document.getElementById('watchlist-overlay-container').style.display = 'initial';
        document.getElementById('watchlist-overlay-empty-msg').style.display = 'none';
        var watchlist_container = document.getElementById('watchlist-overlay');
        watchlist_container.innerHTML = "";
        for (movie of JSON.parse(list)) {
            console.log(movie.Title);
            let imgurl = "images/unknown.png";
            if (movie.Poster != "N/A" && movie.Poster != undefined && movie.Poster != null && movie.Poster != "") {
                imgurl = movie.Poster;
            }
            var watchlist = `
                <div class="tile is-child is-2" id="watchlist-`+ movie.imdbID + `">
                    <div class="smallmovie">
                        <ul>
                            <div class="card-home">
                                <li>
                                    <div style="height: 13.5em;" class="imgbox">
                                        <img src="` + imgurl + `"
                                            class="poster-little-home smallposter">
                                        <div class="middle">
                                            <ul>
                                                <li>
                                                    <a href="" class="button is-small is-primary is-rounded">Open &nbsp; <i class="fas fa-external-link-alt"></i></a>
                                                </li>
                                                <li>
                                                    <a onclick="RemoveElemFromWatchlistUI(this)" data-imdb-id="`+ movie.imdbID + `" class="button is-small is-primary is-rounded">Delete &nbsp; <i class="far fa-trash-alt"></i></a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <p class="caption">
                                        `+ movie.Title + `
                                    </p>                                               
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            `;

            watchlist_container.insertAdjacentHTML('beforeend', watchlist);
        }
    }
    else {
        document.getElementById('watchlist-overlay-container-backbutton').style.display = 'initial';
        document.getElementById('watchlist-overlay-container').style.display = 'initial';
        document.getElementById('watchlist-overlay-empty-msg').style.display = 'initial';
    }
}
function CloseWatchlist() {
    console.log("Closing Watchlist...");
    document.getElementById('watchlist-overlay-container-backbutton').style.display = 'none';
    document.getElementById('watchlist-overlay-container').style.display = 'none';
    document.getElementById('watchlist-overlay').innerHTML = '';
}

function SaveToWatchlist(id, title, poster) {
    var watchlist = localStorage.getItem("Watchlist");
    if (watchlist != null && watchlist != "[]" && watchlist != "") { //check if there is a watchlist
        var data = JSON.parse(watchlist);
        if (!_.find(data, { 'imdbID': id })) {
            data.push(
                {
                    'Title': title,
                    'Poster': poster,
                    'imdbID': id,
                }
            );
            localStorage.setItem("Watchlist", JSON.stringify(data));
        }
    }
    else {
        localStorage.setItem("Watchlist", JSON.stringify(
            [
                {
                    'Title': title,
                    'Poster': poster,
                    'imdbID': id,
                }
            ]
        ));
    }
}

function RemoveFromWatchlist(id) {
    var watchlist = localStorage.getItem("Watchlist");
    if (watchlist != null && watchlist != "[]" && watchlist != "") { //check if there is a watchlist
        var data = JSON.parse(watchlist);
        if (_.find(data, { 'imdbID': id })) {
            data = data.filter(item => item.imdbID !== id);
            localStorage.setItem("Watchlist", JSON.stringify(data));
        }
    }
}

function RemoveElemFromWatchlistUI(elem) {
    let id = elem.getAttribute('data-imdb-id');
    let child = document.getElementById("watchlist-" + id);
    child.parentNode.remove(child);
    RemoveFromWatchlist(id);
    var watchlist = localStorage.getItem("Watchlist");
    if (watchlist != null && watchlist != "[]" && watchlist != "") { //check if there is a watchlist
        var list = JSON.parse(watchlist);
        if (!_.find(list, { 'imdbID': id })) {
            document.getElementById('watchlist').classList.remove('is-link');
            overlay.showplus = true;
        }
        else {
            document.getElementById('watchlist').classList.add('is-link');
            overlay.showplus = false;
        }
    }
    else {
        document.getElementById('watchlist-overlay-container-backbutton').style.display = 'initial';
        document.getElementById('watchlist-overlay-container').style.display = 'initial';
        document.getElementById('watchlist-overlay-empty-msg').style.display = 'initial';
    }
}

function FilterMovies(c, movies) {
    //var movies = popularmoviesjson;
    var count = 0;
    filtered = [];
    for (movie of movies) {
        if (count == 20) {
            break;
        }
        var checks = [];
        if (c[1].length > 0) { /*check if the year arr is not empty*/
            var yearcheck = false;
            for (item of c[1]) {
                var currentyear = new Date().getFullYear();
                var rangeStart;
                switch (item) {
                    case "Recent":
                        rangeStart = currentyear - 9;
                        break;
                    case "2000s":
                        rangeStart = 2000;
                        break;
                    case "'90s":
                        rangeStart = 1990;
                        break;
                    case "'80s":
                        rangeStart = 1980;
                        break;
                    case "'70s":
                        rangeStart = 1970;
                        break;
                    case "'60s":
                        rangeStart = 1960;
                        break;
                    case "'50s":
                        rangeStart = 1950;
                        break;
                    case "'40s":
                        rangeStart = 1940;
                        break;
                    case "'30s":
                        rangeStart = 1930;
                        break;
                    case "Classic":
                        rangeStart = 1920;
                        break;
                    default:
                        rangeStart = currentyear - 9;
                        break;
                }
                yearcheck = Number(movie.Year) >= rangeStart && Number(movie.Year) < rangeStart + 10;
                if (yearcheck) {
                    break;
                }
            }
            checks.push(yearcheck);
        }

        if (c[2].length > 0) { /*check if the rating arr is not empty*/
            var ratingcheck = false;
            var highlyrated = Number(movie.imdbRating) >= 7;
            var awardwinning = movie.Awards != "N/A";

            if ((c[2].includes("Highly Rated") === true) && (c[2].includes("Award-Winning") === true)) {
                if (highlyrated && awardwinning) {
                    ratingcheck = true;
                }
            }
            else if (c[2].includes("Highly Rated")) {
                ratingcheck = highlyrated;
            }
            else if (c[2].includes("Award-Winning")) {
                ratingcheck = awardwinning;
            }

            checks.push(ratingcheck);
        }

        if (c[3].length > 0) { /*check if the genre arr is not empty*/
            var genrecheck = false;
            var userPreferredGenres = c[3].slice(0); /* eg. ["Action", "Comedy"] */
            if (c[3].includes("Only")) {
                var sorted = userPreferredGenres.sort(sortArr);
                var resorted = _.remove(sorted, item => item != "Only");
                genrecheck = _.isEqual(resorted, movie.Genre.split(", "));
            }
            else {
                genrecheck = arrayContainsArray(movie.Genre.split(", "), userPreferredGenres);
            }

            checks.push(genrecheck);
        }

        if (c[4].length > 0) { /*check if the age arr is not empty*/
            if (c[4].includes("NC-17")) {
                c[4].push("X");
            }
            var agecheck = c[4].includes(movie.Rated);
            checks.push(agecheck);
        }

        var finalscore = checks.every((val) => val === true); //makes sure all the options in the filter are true

        if (finalscore) {
            filtered.push(movie);
            count++;
        }
    }

    return filtered;
}

function PreloadSearchBar() {
    a = document.getElementById("hints-hints");
    a.innerHTML = '';
    overlay.inputtopcornermsg = "popular movies";
    arr.slice(0, 6).forEach(title => {
        b = document.createElement("li");
        b.innerHTML = title;

        var inp = document.createElement("input");
        inp.type = "hidden";
        inp.value = title;
        b.insertAdjacentElement("beforeend", inp);

        b.addEventListener("click", function (e) {
            overlay.query = this.getElementsByTagName("input")[0].value;
            a.innerHTML = '';
            SearchMovies();
        });
        a.insertAdjacentElement("beforeend", b);
    })
}

function PreloadPopularMovies() {
    let moviecount = 0;
    for (movie of popularmoviesjson) {
        if (moviecount == 20) {
            break;
        }

        overlay.twentypopularmovies.push(movie); //preload twenty popular movies into the home screen and search screen
        moviecount++;
    }
    overlay.filteredmovies = overlay.twentypopularmovies.slice(0); //push to home screen
    /* NOT NEEDED SINCE THE       =====\
    POPULARITY ATTRIBUTE IN       ======\ //overlay.filteredmovies_sorted_by_popularity = twentypopularmovies.slice(0); //so the sort works; otherwise filteredmovies_sorted_by_popularity would be empty
    THE JSON CAN BE USED TO       ======/
    RESORT THROUGH THE JSON       =====/ 
    */
    overlay.searchedmovies = overlay.twentypopularmovies.slice(0); //push to search screen
    PreloadSearchBar();
    overlay.navbar = "Popular movies"; //change navbar msg from "20 results found" to "Popular movies"
}



function sorter(operation, array) {
    if (operation == "popularity") {
        array = _.orderBy(array, ['Popularity'], ["asc"]);
    }
    else if (operation == "newest") {
        //array = _.orderBy(array, ['Year'], ['desc']);
        array = _.orderBy(array, [movie => new Date(movie.Released)], ["desc"]);
    }
    else if (operation == "rating - high to low") {
        array = _.orderBy(array, ['imdbRating'], ['desc']);
    }
    else if (operation == "rating - low to high") {
        array = _.orderBy(array, ['imdbRating'], ['asc']);
    }

    return array;
}



async function computeAutocomplete(q) {
    a = document.getElementById("hints-hints");
    a.innerHTML = '';
    var then = new Date().getTime();
    fuzzysort.goAsync(q, arr, { limit: 5, allowTypo: true }).then(results => {
        var now = new Date().getTime();
        var timecount = now - then;
        overlay.inputtopcornermsg = "showing " + results.length + " results (" + timecount + " milliseconds)";
        results.forEach(r => {
            highlighted = fuzzysort.highlight(r, "<strong>", "</strong>");
            b = document.createElement("li");
            b.innerHTML = highlighted;
            var inp = document.createElement("input");
            inp.type = "hidden";
            inp.value = r.target;
            b.addEventListener("click", function (e) {
                document.getElementById("hints-searchbar").blur();
                overlay.query = this.getElementsByTagName("input")[0].value;
                a.innerHTML = '';
                SearchMovies();
            });
            b.insertAdjacentElement("beforeend", inp);
            a.insertAdjacentElement("beforeend", b);
        });
    })
}

function CloseListsAndSearch(e) {
    document.getElementById("hints-searchbar").blur()
    overlay.query = this.getElementsByTagName("input")[0].value;
    a.innerHTML = '';
    SearchMovies();
}

function SelectDropdown(el, totoggle) {
    if (!el.classList.contains(totoggle)) {
        getSiblings(el).forEach(elem => elem.classList.remove(totoggle));
        el.classList.add(totoggle);
        overlay.sortvalue = el.innerText.toLowerCase();
    }
}

//extras

function arrayContainsArray(superset, subset) {
    /*check if the array "superset" contains the elements of the array "subset" */
    if (0 === subset.length || superset.length < subset.length) {
        return false;
    }
    for (var i = 0; i < subset.length; i++) {
        if (superset.indexOf(subset[i]) === -1) return false;
    }
    return true;
}

function sortArr(a, b) {
    /* alphabatize an arr. use with sort like so: var sorted = ["Peaches", "Cranberries", "Apples"].sort(sortArr);  */
    if (a < b) return -1;
    else if (a > b) return 1;
    return 0;
}

function getSiblings(elem) {
    //Get siblings of an element
    // Setup siblings array and get the first sibling
    var siblings = [];
    var sibling = elem.parentNode.firstChild;

    // Loop through each sibling and push to the array
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling
    }

    return siblings;

}

let isEmpty = a => Array.isArray(a) && a.every(isEmpty);
/*one-liner to check if an array is empty. call it like a function.
eg. isEmpty(["apples", "cranberries"]) will return false */


