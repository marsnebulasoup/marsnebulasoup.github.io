function ChangeTimeZone(){
	var menu = document.getElementById("selTimezone");
	menu.setAttribute("class", "isActive");
}

function CloseSelectTimezone(){
	var menu = document.getElementById("selTimezone");
	menu.removeAttribute("class", "isActive");
}