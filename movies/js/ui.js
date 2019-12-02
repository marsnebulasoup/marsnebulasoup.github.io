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
        if (searchbar.value == "") {
            PreloadPopularMovies();
        }
    }
}

function unsetFocused() {
    var searchbar = document.getElementById("hints-searchbar");
    var hints = document.getElementById("hints-hints-container");
    searchbar.classList.remove("hints-searchbar-focus");
    hints.style.display = "none";
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

function PreloadPopularMovies() {
    let moviecount = 0;
    let twentypopularmovies = [];
    let twentypopularmovies_formatted = [];
    a = document.getElementById("hints-hints");
    a.innerHTML = '';
    overlay.inputtopcornermsg = "popular movies";
    for (movie of popularmoviesjson) {
        if (moviecount == 20) {
            break;
        }
        if (moviecount <= 6) { //preload six popular movies into the searchbar
            item = movie.Title;
            overlay.hints += "<li>" + item + "<input type=\"hidden\" value=\"" + item + "\">";
            b = document.createElement("li");
            b.innerHTML = item

            var inp = document.createElement("input");
            inp.type = "hidden";
            inp.value = item;
            b.insertAdjacentElement("beforeend", inp);

            b.addEventListener("click", function (e) {
                overlay.query = this.getElementsByTagName("input")[0].value;
                a.innerHTML = '';
                SearchMovies();
            });
            a.insertAdjacentElement("beforeend", b);
        }
        twentypopularmovies.push(movie);
        twentypopularmovies_formatted.push({obj: movie}); //preload twenty popular movies into the home screen and search screen
        moviecount++;
    }
    overlay.filteredmovies = twentypopularmovies.slice(0); //push to home screen
    /* NOT NEEDED SINCE THE         ====>
    POPULARITY ATTRIBUTE IN         ====> //overlay.filteredmovies_sorted_by_popularity = twentypopularmovies.slice(0); //so the sort works; otherwise filteredmovies_sorted_by_popularity would be empty
    THE JSON CAN BE USED TO RESORT  ====>
    THROUGH THE JSON                ====> 
    */
    Display(twentypopularmovies_formatted); //push to search screen
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

function SelectDropdown(el) {
    if (!el.classList.contains("selected")) {
        getSiblings(el).forEach(elem => elem.classList.remove("selected"));
        el.classList.add("selected");
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


