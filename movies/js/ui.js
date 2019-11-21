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
    SearchFor(ParseJson(), input);
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
            displayPopularMovies();
        }
    }
}

function unsetFocused() {
    var searchbar = document.getElementById("hints-searchbar");
    var hints = document.getElementById("hints-hints-container");
    searchbar.classList.remove("hints-searchbar-focus");
    hints.style.display = "none";
}

function displayPopularMovies() {
    var popularmoviescount = 0;
    a = document.getElementById("hints-hints");
    a.innerHTML = '';
    overlay.inputtopcornermsg = "popular movies";
    for (item of arr) {
        if (popularmoviescount == 6) { break }
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
        popularmoviescount++;
    }
}

function computeAutocomplete(val) {
    var a, b, i;
    a = document.getElementById("hints-hints");
    a.innerHTML = '';
    var maxloops = 6;
    var loopcount = 0;
    for (i = 0; i < arr.length; i++) {
        overlay.inputtopcornermsg = "showing " + loopcount + " of the " + i + " movies searched";
        if (loopcount == maxloops) {
            break;
        }
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            fullword = arr[i];
            highlighted = fullword.substr(0, val.length);
            therest = fullword.substr(val.length);

            b = document.createElement("li");
            b.innerHTML = "<strong>" + highlighted + "</strong>" + therest;

            var inp = document.createElement("input");
            inp.type = "hidden";
            inp.value = fullword;
            b.insertAdjacentElement("beforeend", inp);

            b.addEventListener("click", function (e) {
                document.getElementById("hints-searchbar").blur();
                overlay.query = this.getElementsByTagName("input")[0].value;
                a.innerHTML = '';
                SearchMovies();
            });
            a.insertAdjacentElement("beforeend", b);
            loopcount++;
        }
    }
}

function CloseListsAndSearch(e) {
    document.getElementById("hints-searchbar").blur()
    overlay.query = this.getElementsByTagName("input")[0].value;
    a.innerHTML = '';
    SearchMovies();
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


var testobj_delete_this_if_you_find_it = {
    "Title": "Joker",
    "Year": "2019",
    "Rated": "R",
    "Genre": "Crime, Drama, Thriller",
    "Awards": "N/A",
    "Poster": "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
    "imdbRating": "8.9",
    "Type": "movie",    
    "imdbID": "tt7286456"
}