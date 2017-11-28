function redirectToMain(){
	chrome.tabs.query({"title": "HiVi"}, function(Tabs){
		if (Tabs.length == 0) {
			chrome.tabs.create({"url":"index.html","selected":true}, function(tab){
			});
		} else {
			chrome.tabs.update(Tabs[0].id, {"selected":true});
		}
	});
};

document.getElementById("goToMain").addEventListener("click",redirectToMain);
