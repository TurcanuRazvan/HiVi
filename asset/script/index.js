(function(){
	
	document.getElementById('container').style.display='none';

	document.getElementById('despreBtn').addEventListener('click', function() {
		document.getElementById('container').style.display='none';
		document.getElementsByClassName('list-history')[0].classList.add('displayNone');
		// document.getElementsByClassName('create-graphics')[0].classList.add('displayNone');
		document.getElementsByClassName('despre')[0].classList.remove('displayNone');
		document.getElementsByClassName('footer')[0].classList.remove('displayNone');
	});
	document.getElementById('historyBtn').addEventListener('click', function() {
		document.getElementById('container').style.display='none';
		document.getElementsByClassName('despre')[0].classList.add('displayNone');
		document.getElementsByClassName('footer')[0].classList.add('displayNone');
		// document.getElementsByClassName('create-graphics')[0].classList.add('displayNone');
		document.getElementsByClassName('despre')[0].classList.add('displayNone');
		document.getElementsByClassName('list-history')[0].classList.remove('displayNone');
	});
	// document.getElementById('graphicsBtn').addEventListener('click', function() {
	// 	document.getElementsByClassName('despre')[0].classList.add('displayNone');
	// 	document.getElementsByClassName('footer')[0].classList.add('displayNone');
	// 	document.getElementsByClassName('list-history')[0].classList.add('displayNone');
	// 	document.getElementsByClassName('despre')[0].classList.add('displayNone');
	// 	document.getElementsByClassName('create-graphics')[0].classList.remove('displayNone');
	// });

})();


// graphicsBtn