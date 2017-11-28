function history(onSearchHistory){
	var query={text:""}
	chrome.history.search(query,onSearchHistory);
};

function deleteHistoryItem(url){
	var detail={url:url};
	chrome.history.deleteUrl(detail);
};