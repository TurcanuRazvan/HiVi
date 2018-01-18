function history(onSearchHistory){
	var query={text:""}
	chrome.history.search(query,onSearchHistory);
};

function deleteHistoryItem(url){
	var detail={url:url};
	chrome.history.deleteUrl(detail);
};

function returnVisits(details, callback,domain,url){ //API google
	chrome.history.getVisits(details,callback);
	// callback(details);
};