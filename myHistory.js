var checkedHistoryItems=[]; //elementele bifate /list de url-uri
var backgroundWindow=chrome.extension.getBackgroundPage();
var urlsCount={};

function getHostName(url) {
    var match = url.match(/:\/\/(www\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}

function svgChart() {
	document.getElementById('container').style.display='block';
    var ll=[];
    var val=[];
    for ( var prop in urlsCount ) {
    if ( urlsCount.hasOwnProperty( prop ) ) {
       ll.push(prop)
       val.push(urlsCount[prop])
    }
}

    var some=[]
    for(var i=0;i<ll.length;++i){
        var temp={};
        temp.name=ll[i];
        temp.y=val[i];
        some.push(temp);
    }
    console.log(some);
    /*var input = document.createElement("div");
	input.setAttribute("id", "cotainer");
	input.setAttribute("style", "width:100%; height:400px;");*/

    $(function () {
    var myChart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Title'
    },
    subtitle: {
        text: 'Subtitle'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Total '
        }

    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{y}'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },

    series: [{
        name: 'Domains',
        colorByPoint: true,
        data: some
    }]
    });
    });
}

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
	input.setAttribute("data-url",historyItem.url);
	input.setAttribute("class","history-item-checkbox");

	var name = document.createElement("span");
	name.setAttribute("class", "name");
	name.innerHTML=historyItem.title;

	var time = document.createElement("span");
	time.setAttribute("class", "time");

	time.innerHTML=historyItem.url;//historyItem.lastVisitTime;

	var url = document.createElement("span");
	url.setAttribute("class", "url");
	url.innerHTML=historyItem.url;

	var li=document.createElement("li");
	li.appendChild(input);
	li.appendChild(name);
	li.appendChild(time);

	return li;
}

function onClickHistoryItemCheckbox(e){  //iau id-ul la ce am dat checkbox
    if(e.target && e.target.className== 'history-item-checkbox'){
    	if(e.target.checked){
    		checkedHistoryItems.push(e.target.dataset.url);
    	}
    	else{
    		var itemIndex=checkedHistoryItems.indexOf(e.target.dataset.url);
    		if (itemIndex!==-1) {
    			checkedHistoryItems.splice(itemIndex,1);//am un element
    		}
    	}

    	if(checkedHistoryItems.length){
    		document.getElementById("list-actions").classList.remove('displayNone');

    	}else{ document.getElementById("list-actions").classList.add('displayNone');}
 	}
 }
function onDeleteHistoryItems(){
	checkedHistoryItems.forEach(function(url){
		backgroundWindow.deleteHistoryItem(url);
	});
	checkedHistoryItems.length=0;
	refreshHistory();
}


function refreshHistory(){
	var historyList=document.getElementById("history-list");
	historyList.innerHTML="";
	backgroundWindow.history(onSearchHistory);
}

function onLoad(){
	var historyList=document.getElementById("history-list");
	historyList.addEventListener('click',onClickHistoryItemCheckbox);
	document.getElementById("delete-history-items").addEventListener("click",onDeleteHistoryItems);

    document.getElementById("exp").addEventListener("click",svgChart);

	refreshHistory();
}

function onSearchHistory(results) {
	console.log(results);
	var historyList=document.getElementById("history-list");
	results.forEach(function(historyItem){
		var historyElement= getHistoryElement(historyItem);
		historyList.appendChild(historyElement);

		var newUrl = getHostName(historyItem.url)
	    
		if(urlsCount.hasOwnProperty(newUrl)){
	        urlsCount[newUrl]+=1;
	    } else {
	        urlsCount[newUrl]=1;
	    }

	})
	console.log(urlsCount);
}

if (document.readyState !== 'loading') {
  onLoad()
} else {
  // the document hasn't finished loading/parsing yet so let's add an event handler
  document.addEventListener('DOMContentLoaded', onLoad)
}


