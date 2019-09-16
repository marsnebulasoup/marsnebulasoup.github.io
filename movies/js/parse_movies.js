//Parses the movies.json file

function LoadFile() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		var json_stuff = this.responseText;
	  }
	};
	xmlhttp.open("GET", "db/movies.json", true);
	xmlhttp.send();	
	
	return json_stuff;
	
}


function ParseJson(json_stuff){
	var parsed = JSON.parse(json_stuff);
	
	for(item of parsed){
		console.log(item)
	}
	
}

ParseJson(LoadFile());