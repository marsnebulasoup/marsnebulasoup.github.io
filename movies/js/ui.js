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

function SearchMovies() {
    var input = document.getElementById("real_searchbar").value;
    var results = SearchFor(ParseJson(), input);
	console.log(results)

}

function TransformSearch(state) {
    var overlay = document.getElementById("overlay-search");
    var html = document.getElementById("everything");
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

