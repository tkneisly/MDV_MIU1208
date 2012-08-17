// Week 1, Project 1
// David Tyler Kneisly
// MIU 1208
// Theater Tracker

// Wait until the DOM is ready
window.addEventListener('DOMContentLoaded', function() {


	// getElementById Function
	function ge(x) {
		var theElement = document.getElementById(x);
		return theElement;
	}

	// Create 'Select Field' element, and populate with options
	function makeCats () {
		var formTag = document.getElementsByTagName('form'),
		// This will become an array of all the form tags in the additem.html doc.
		selectLi = ge('select'),
		makeSelect = document.createElement('select');
		makeSelect.setAttribute('id', 'groups');
		for (var i=0, j=theaterGroups.length; i < j; i++) {
			var makeOption = document.createElement('option');
			var optText = theaterGroups[i];
			makeOption.setAttribute('value', optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	}

	// Find value of selected radio button.
	function getSelectedRadio() {
		var radios = document.forms[0].genre;
		for (var i=0; i < radios.length; i++) {
			if (radios[i].checked) {
				genreValue = radios[i].value;
			}
		}
	}

	// Find value of selected checkboxes.
	function getCheckboxValue() {
		if (ge('favorite').checked) {
			favoriteValue = ge('favorite').value;
		} else {
			favoriteValue = "No";
		}
	}

	// Toggle controls
	function toggleControls(n) {
		switch(n) {
			case 'on':
				ge('theaterForm').style.display = "none";
				ge('clear').style.display = "inline";
				ge('display').style.display = "none";
				ge('addNew').style.display = "inline";
				break;
			case 'off':
				ge('theaterForm').style.display = "block";
				ge('clear').style.display = "inline";
				ge('display').style.display = "inline";
				ge('addNew').style.display = "none";
				ge('items').style.display = "none";
				break;
			default:
				return false;
		}
	}

	// Store Data
	function storeData(key) {
		if(!key) {
			var id = Math.floor(Math.random()*100000001);
		} else {
			id = key;
		}
		getSelectedRadio();
		getCheckboxValue();
		var item = {};
		item.groups = ['Group:', ge('groups').value];
		item.theaters = ['Theater:', ge('theatername').value];
		item.movies = ['Movie:', ge('movie').value];
		item.theaternums = ['Theater #:', ge('theaternum').value];
		item.datevisited = ['Date Visited:', ge('date').value];
		item.rating = ['Rating:', ge('rating').value];
		item.category = ['Genre:', genreValue];
		item.favs = ['Favorite:', favoriteValue];
		item.note = ['Notes:', ge('notes').value];
		localStorage.setItem(id, JSON.stringify(item));
		alert('Theater is saved!');
		window.location.reload();
		return false;
	}

	// Show Data
	function showData () {
		if (localStorage.length === 0) {
			alert('No saved theaters.  Default data was added.');
			autoFillData();
			toggleControls('off');
		} else {
			toggleControls('on');
			var makeDiv = document.createElement('div');
			makeDiv.setAttribute('id', 'items');
			var makeList = document.createElement('ul');
			makeDiv.appendChild(makeList);
			document.body.appendChild(makeDiv);
			// Below for-loop looks in Local Storage for data
			for (var i=0, l=localStorage.length; i < l; i++) {
				var makeLi = document.createElement('li');
				var linksLi = document.createElement('li');
				makeList.appendChild(makeLi);
				var key = localStorage.key(i);
				var value = localStorage.getItem(key);
				// Below variable converts the string from Local Storage back into an object
				var obj = JSON.parse(value);
				// Below variable and for-loop creates a sub-list and appends to the above list (li)
				var makeSubList = document.createElement('ul');
				makeLi.appendChild(makeSubList);
				getImage(obj.groups[1], makeSubList);
				for (var n in obj) {
					var makeSubLi = document.createElement('li');
					makeSubList.appendChild(makeSubLi);
					var optSubText = obj[n][0]+" "+obj[n][1];
					makeSubLi.innerHTML = optSubText;
					makeSubList.appendChild(linksLi);
				}
				// Below function creates Edit and Delete buttons
				makeItemLinks(localStorage.key(i), linksLi);
			}
		}
	}

	// Get image for the group/category being displayed
	function getImage(catName, makeSubList) {
		var imageLi = document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement('img');
		var setSrc = newImg.setAttribute('src', 'images/'+catName+'.png');
		imageLi.appendChild(newImg);
	}

	// Auto Populate Local Storage
	function autoFillData() {
		// The JSON Object data required is coming from json.js file.
		// Below function stors JSON data into Local Storage.
		for (var n in json) {
			var id = Math.floor(Math.random()*100000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}

	// Make Item Links
	// Creates the edit and delete links for each stored item displayed.
	function makeItemLinks(key, linksLi) {
		// Create the Edit link. Receives 'key' from showData function.
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Theater";
		editLink.addEventListener('click', editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);

		// Adds a line break between ahrefs
		var breakTag = document.createElement('br');
		linksLi.appendChild(breakTag);

		// Create the Delete link.  Receives 'key' from showData function.
		var deleteLink = document.createElement('a');
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Theater";
		deleteLink.addEventListener('click', deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	}

	// Edit a Single Item
	function editItem() {
		// Get data from item from Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		// Show the form
		toggleControls('off');

		// Populate the form fields with current localStorage values.
		ge('groups').value = item.groups[1];
		ge('theatername').value = item.movies[1];
		ge('movie').value = item.theaters[1];
		ge('theaternum').value = item.theaternums[1];
		ge('date').value = item.datevisited[1];
		ge('level').value = item.rating[1];
		ge('rating').value = item.rating[1];
		var radios = document.forms[0].genre;
		for (var i=0; i < radios.length; i++) {
			if (radios[i].value == "Science-Fiction" && item.category[1] == "Science-Fiction") {
				radios[i].setAttribute('checked', 'checked');
			} else if (radios[i].value == "Fantasy" && item.category[1] == "Fantasy") {
				radios[i].setAttribute('checked', 'checked');
			} else if (radios[i].value == "Thriller" && item.category[1] == "Thriller") {
				radios[i].setAttribute('checked', 'checked');
			} else if (radios[i].value == "Drama" && item.category[1] == "Drama") {
				radios[i].setAttribute('checked', 'checked');
			} else if (radios[i].value == "Indie" && item.category[1] == "Indie") {
				radios[i].setAttribute('checked', 'checked');
			} else if (radios[i].value == "Action" && item.category[1] == "Action") {
				radios[i].setAttribute('checked', 'checked');
			}

		}
		if (item.favs[1] == "Yes") {
			ge('favorite').setAttribute('checked', 'checked');
		}
		ge('notes').value = item.note[1];
		saveTheater.removeEventListener('click', storeData);
		ge('submit').value = "Save Edits";
		var editSubmit = ge('submit');
		editSubmit.addEventListener('click', validate);
		editSubmit.key = this.key;
	}

	// Delete Item
	function deleteItem() {
		var ask = confirm("Are you sure you want to delete?");
		if(ask) {
			localStorage.removeItem(this.key);
			alert("Deleted!");
			window.location.reload();
		} else {
			alert("The theater is still saved!");
		}
	}

	// Clear Data
	function clearData() {
		if(localStorage.length === 0) {
			alert('No theaters to clear');
			scrollTo(0,0);
		} else {
			var ask = confirm("Are you sure you want to clear all data?");
			if(ask) {
				alert('All theaters deleted');
				window.location.reload();
				localStorage.clear();
				return false;
			} else {
				alert("Your theaters are still saved!");
			}			
		}
	}

	function validate(e) {
		// Define the elements to be checked
		var getGroup = ge('groups');
		var getTheater = ge('theatername');
		var getMovie = ge('movie');
		var getTheaterNum = ge('theaternum');
		var getDate = ge('date');
		var errorBox = ge('errors');

		// Reset the Error Mesages
		errMsg.innerHTML = "";
		getGroup.style.border = "1px solid black";
		getTheater.style.border = "1px solid black";
		getMovie.style.border = "1px solid black";
		getTheaterNum.style.border = "1px solid black";
		getDate.style.border = "1px solid black";
		errorBox.style.border = "1px solid #aaa";

		// Get error messages
		var messageAry = [];
		// Group Validation
		if(getGroup.value === "--Choose a chain--") {
			var groupError = "Please choose a theater chain.";
			getGroup.style.border = "1px solid #ff8e33";
			errorBox.style.border = "1px solid #ff8e33";
			messageAry.push(groupError);
		}
		// Title Validation (RegExp)
		if(getTheater.value === "") {
			var theaterError = "Please enter a theater name.";
			getTheater.style.border = "1px solid #ff8e33";
			errorBox.style.border = "1px solid #ff8e33";
			messageAry.push(theaterError);
		}
		// Author Validation
		if(getMovie.value === "") {
			var movieError = "Please enter a movie name.";
			getMovie.style.border = "1px solid #ff8e33";
			errorBox.style.border = "1px solid #ff8e33";
			messageAry.push(movieError);
		}
		// Pages Validation
		if(getTheaterNum.value === "") {
			var numError = "Please enter the theater #.";
			getTheaterNum.style.border = "1px solid #ff8e33";
			errorBox.style.border = "1px solid #ff8e33";
			messageAry.push(numError);
		}
		// Date Validation using RegEx
		var re = /^[\d][\d][\d][\d]-[01]?[\d]-[0-3]?[\d]$/;
		if(!(re.exec(getDate.value))) {
			var dateError = "Please enter a valid date.";
			getDate.style.border = "1px solid #ff8e33";
			errorBox.style.border = "1px solid #ff8e33";
			messageAry.push(dateError);
		}
		// If there are errors, display messages
		if(messageAry.length >= 1) {
			for(var i=0, j=messageAry.length; i < j; i++) {
				var txt = document.createElement('li');
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			alert("Please fill in the required fields.");
			scroll(0,0);
			e.preventDefault();
			return false;
		} else {
			storeData(this.key);
		}
	}

	// Defaults for Variables
	var 
	theaterGroups = ["--Choose a chain--", "Regal", "AMC", "IMAX", "Privately Owned"],
	genreValue,
	favoriteValue = "No",
	errMsg = ge('errors'),
	level
	;
	
	makeCats();
	
	var displayTheaters = ge('display');
	displayTheaters.addEventListener('click', showData);
	var clearTheaters = ge('clear');
	clearTheaters.addEventListener('click', clearData);
	var saveTheater = ge('submit');
	saveTheater.addEventListener('click', validate);
	var hideAddress = window.scrollTo(0,0);
	window.addEventListener('load', hideAddress);
});