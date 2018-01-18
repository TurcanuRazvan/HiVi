hivi.init = function (){
    function loadHistoryCallback(history){
        hivi.graph.init(history);
    }
    
    hivi.history.init(loadHistoryCallback);
}
if (document.readyState !== 'loading') {
	// onLoad()
	hivi.init()
	
} else {
	// the document hasn't finished loading/parsing yet so let's add an event handler
	document.addEventListener('DOMContentLoaded', hivi.init)
}