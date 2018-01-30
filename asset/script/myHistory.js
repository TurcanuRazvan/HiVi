var hivi = hivi || {};
var urlsCount = {};
hivi.history = (function (window, document) {
	var data = {
		history: []
	};
	var historyCallback = null;
	// var historyArray = [];

	var checkedHistoryItems = []; //elementele bifate /list de url-uri
	
    //-----------------new code grafic-------------------
	function getHostName(url) {
	    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
	    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
	        return match[2];
	    }
	    else {
	        return null;
	    }
	}
	function svgChart() {

	    var key = [];
	    var val = [];
	    var data = [];
	    for (var prop in urlsCount) {
	        if (urlsCount.hasOwnProperty(prop)) {
	            var temp = {};
	            temp.label = prop;
	            temp.value = urlsCount[prop];
	            /*key.push(prop)
                val.push(urlsCount[prop])*/
	            data.push(temp);
				//console.log(temp.label);	
	        }
	    }

	    var div = d3.select("#history-chart").append("div").attr("class", "toolTip");
		
	    var axisMargin = 10,
                margin = 10,
                valueMargin = 4,
                width = parseInt(d3.select('#history-chart').style('width'), 10),
                height = parseInt(d3.select('#history-chart').style('height'), 10),
                barHeight = (height*2 - axisMargin - margin * 2) * 0.4 / data.length,
                barPadding = (height - axisMargin - margin * 2) * 0.6 / data.length,
                data, bar, svg, scale, xAxis, labelWidth = 0;

		max = d3.max(data, function (d) { return d.value; });

	    svg = d3.select('#history-chart')
                .append("svg")
                .attr("width", width)
                .attr("height", height);


	    bar = svg.selectAll("g")
                .data(data)
                .enter()
                .append("g");
				
	    bar.attr("class", "bar")
                .attr("cx", 0)
                .attr("transform", function (d, i) {
                    return "translate(" + margin + "," + (i * (barHeight/2 + barPadding) + barPadding) + ")";
                });

	    bar.append("text")
                .attr("class", "label")
                .attr("y", barHeight / 2)
                .attr("dy", ".35em") //vertical align middle
                .text(function (d) {
                    return d.label;
                }).each(function () {
                    labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
                });

	    scale = d3.scaleLinear()
                .domain([0, max])
                .range([0, width - margin * 2 - labelWidth]);

	    xAxis = d3.axisBottom(scale)
                //.scale(scale)
                .tickSize(-height + 2 * margin + axisMargin);
                //.orient("bottom");

	    bar.append("rect")
                .attr("transform", "translate(" + labelWidth + ", 0)")
                .attr("height", barHeight)
                .attr("width", function (d) {
                    return scale(d.value);
                });

	    bar.append("text")
                .attr("class", "value")
                .attr("y", barHeight / 2)
                .attr("dx", -valueMargin + labelWidth) //margin right
                .attr("dy", ".35em") //vertical align middle
                .attr("text-anchor", "end")
                .text(function (d) {
                    return (d.value + "%");
                })
                .attr("x", function (d) {
                    var width = this.getBBox().width;
                    return Math.max(width + valueMargin, scale(d.value));
                });

	    bar.on("mousemove", function (d) {
				div.style("left", d3.event.pageX + 10 + "px");
				div.style("top", d3.event.pageY - 25 + "px");
				div.style("display", "inline-block");
				div.html((d.label) + "<br>" + (d.value) + "%");
			});
	    bar.on("mouseout", function (d) {
				div.style("display", "none");
                });

	    svg.insert("g", ":first-child")
                .attr("class", "axisHorizontal")
                .attr("transform", "translate(" + (margin + labelWidth) + "," + (height - axisMargin - margin) + ")")
                .call(xAxis);

	}


    //------------------------------------

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
	    //---------cod grafic-----------
		document.getElementById("graphic2").addEventListener('click', svgChart);

	    //------------------------------
		refreshHistory();
	}

	function onSearchHistory(results) {
		// console.log(results);
		data.history = results;
		var historyList = document.getElementById("history-list");
		results.forEach(function (historyItem) {
			var historyElement = getHistoryElement(historyItem);
			historyList.appendChild(historyElement);
		    //---------new code grafic-----------
			var newUrl = getHostName(historyItem.url)

			if (urlsCount.hasOwnProperty(newUrl)) {
			    urlsCount[newUrl] += 1;
			} else {
			    urlsCount[newUrl] = 1;
			}
		    //-----------------------------
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