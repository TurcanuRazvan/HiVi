
var hivi=hivi || {};  //obiect global
hivi.backgroundWindow = chrome.extension.getBackgroundPage();

(function(){

	document.getElementById('despreBtn').addEventListener('click', function() {
		document.getElementsByClassName('list-history')[0].classList.add('displayNone');
		document.getElementsByClassName('create-graphics')[0].classList.add('displayNone');
		document.getElementsByClassName('despre')[0].classList.remove('displayNone');
		document.getElementsByClassName('footer')[0].classList.remove('displayNone');
	});
	document.getElementById('historyBtn').addEventListener('click', function() {
		document.getElementsByClassName('despre')[0].classList.add('displayNone');
		document.getElementsByClassName('footer')[0].classList.add('displayNone');
		document.getElementsByClassName('create-graphics')[0].classList.add('displayNone');
		document.getElementsByClassName('despre')[0].classList.add('displayNone');
		document.getElementsByClassName('list-history')[0].classList.remove('displayNone');
	});
	document.getElementById('graphicsBtn').addEventListener('click', function() {
		document.getElementsByClassName('despre')[0].classList.add('displayNone');
		document.getElementsByClassName('footer')[0].classList.add('displayNone');
		document.getElementsByClassName('list-history')[0].classList.add('displayNone');
		document.getElementsByClassName('despre')[0].classList.add('displayNone');
		document.getElementsByClassName('create-graphics')[0].classList.remove('displayNone');
	});


	document.getElementById('graphic1').addEventListener('click', function() {
		document.getElementById('history-charts').classList.add('displayNone');
		document.getElementById('history-graph-container').classList.remove('displayNone');

	});
	document.getElementById('graphic2').addEventListener('click', function() {
		document.getElementById('history-charts').classList.remove('displayNone');
		document.getElementById('history-graph-container').classList.add('displayNone');

	});

})();