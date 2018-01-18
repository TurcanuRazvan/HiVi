var hivi = hivi || {};
hivi.graph = (function (window, document) {
    var history = [];
    var visits = {};

    // function declarations
    function init(originalHistory) {
        // console.log(history);
        // console.log(history[1].url.split("/"));
        history = maphHistory(originalHistory);
        console.log(history);
        loadVisits();
    };

    function maphHistory(historyList) {
        var domains = {};
        historyList.forEach(function (historyItem) {
            var url = historyItem.url;
            var domainsSplits = url.split("/");

            if (domainsSplits[0] === "chrome-extension:" || domainsSplits[0] === "file:") {
                return;
            }

            var domain = domainsSplits[2];

            if (!domains[domain]) {
                domains[domain] = {
                    'items': [],
                    'domain': domain
                };
            }

            domains[domain].items.push(historyItem);
        });

        var domainKeys = Object.keys(domains);
        var allDoamins = [];
        domainKeys.forEach(function (domain) {
            allDoamins.push(domains[domain]);
        });
        // console.log(allDoamins);

        return allDoamins.slice(0, 10);
    };

    function loadVisits() {
        var backgroundWindow = chrome.extension.getBackgroundPage();
        // debugger;
        console.log(hivi.backgroundWindow);
        history.forEach(function (historyDomain) {
            historyDomain.items.forEach(function(historyItem) {
                
                backgroundWindow.returnVisits({
                    'url':historyItem.url
                }, visitsCallback.bind(null,historyDomain.domain, historyItem.url));

            });

        });
    };

    function visitsCallback(domain,url,visitItems){
        // console.log(visitItems);
       test = visitItems;
       if (!visits[domain]) {
           visits[domain]={};
       }
        visits[domain][url] = visitItems; 
       
        
    };

    setTimeout(function(){ console.log(visits); }, 3000);

    // function draw(history){

    // };

    return {
        init: init
    };

})(window, document);
