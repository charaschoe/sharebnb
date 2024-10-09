function openTab(tabName) {
	var i, tabcontent, tabs;

	// Hide all tab content
	tabcontent = document.getElementsByClassName("tab-content");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Show the selected tab content
	document.getElementById(tabName).style.display = "block";
}
