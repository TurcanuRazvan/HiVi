var hivi = hivi || {};

hivi.history = (function (window, document) {
	var data = {
		history: []
	};
	var historyCallback = null;
	// var historyArray = [];

	var checkedHistoryItems = []; //elementele bifate /list de url-uri
	

	function getHistoryElement(historyItem) {
		// <li>
		// 	<input type="checkbox" name="check">
		// 	<span class="name">HiVi</span>
		// 	<span class="time">10:21</span>
		// 	<span class="url">chrome-extension://njooimamcjjelmehonchdmjnhhgkdnak/index.html</span>
		// </li>
		var input = document.createElement("input");
		input.setAttribute("type", "checkbox");
		input.setAttribute("name", "check");
		input.setAttribute("data-url", historyItem.url);
		input.setAttribute("class", "history-item-checkbox");

		var name = document.createElement("span");
		name.setAttribute("class", "name");
		name.innerHTML = historyItem.title;

		var time = document.createElement("span");
		time.setAttribute("class", "time");
		time.innerHTML = historyItem.lastVisitTime;

		var url = document.createElement("span");
		url.setAttribute("class", "url");
		url.innerHTML = historyItem.url;

		var li = document.createElement("li");
		li.appendChild(input);
		li.appendChild(name);
		li.appendChild(time);

		return li;
	}

	function onClickHistoryItemCheckbox(e) {  //iau id-ul la ce am dat checkbox
		if (e.target && e.target.className == 'history-item-checkbox') {
			if (e.target.checked) {
				checkedHistoryItems.push(e.target.dataset.url);
			}
			else {
				var itemIndex = checkedHistoryItems.indexOf(e.target.dataset.url);
				if (itemIndex !== -1) {
					checkedHistoryItems.splice(itemIndex, 1);//am un element
				}
			}

			if (checkedHistoryItems.length) {
				document.getElementById("list-actions").classList.remove('displayNone');

			} else { document.getElementById("list-actions").classList.add('displayNone'); }
		}
	}
	function onDeleteHistoryItems() {
		checkedHistoryItems.forEach(function (url) {
			hivi.backgroundWindow.deleteHistoryItem(url);
		});
		checkedHistoryItems.length = 0;
		refreshHistory();
	}


	function refreshHistory() {
		var historyList = document.getElementById("history-list");
		historyList.innerHTML = "";
		hivi.backgroundWindow.history(onSearchHistory);
	}

	function onLoad() {
		var historyList = document.getElementById("history-list");
		historyList.addEventListener('click', onClickHistoryItemCheckbox);
		document.getElementById("delete-history-items").addEventListener("click", onDeleteHistoryItems);
		refreshHistory();
	}

	function onSearchHistory(results) {
		// console.log(results);
		data.history = results;
		var historyList = document.getElementById("history-list");
		results.forEach(function (historyItem) {
			var historyElement = getHistoryElement(historyItem);
			historyList.appendChild(historyElement);
		});

		if (typeof historyCallback === 'function') {
			historyCallback(results);
		} 
	}

	function init(onLoadHistory){
		historyCallback = onLoadHistory;
		onLoad();
	}

	function getHistory(){
		return data.history;
	}


	return {
		'init': init,
		'getHistory': getHistory
	}

})(window, document);





