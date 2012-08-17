// Week 3, Project 3
// David Tyler Kneisly
// MUI 1208
// Movie Night
// Gold Main.JS

// Wait until the DOM is ready


var parseBookForm = function(itm){
	console.log(localStorage);
};

$('#showItems').bind('pagebeforechange', function(e, data){
	
	if(typeof data.toPage === "string" ) {
		var a = $.mobile.path.parseUrl(data.toPage),
			re = /^#category-item/;
		if (a.hash.search(re) !== -1) {
			showCategory(a, data.options);
			e.preventDefault();
		}
	}
	//checkUserData();
	//alert("JS has loaded");
	window.location.reload();
	
});


// The below script is loaded into DOM when addItem.html is initialized
$(document).bind('pageinit', function(){

	var
	bookForm = $('#addmovieform'),
	errorslink = $('#errorslink'),
	submittedlink = $('#submittedlink'),
	allitemslink = $('#allitemslink'),
	favorite = $('#favorite'),
	genreValue,
	genreChecked,
	level,
	favoriteValue = "No"
	;
	
	// Get Element ID's
	// jQuery Mobile method will also work
	function ge(x) {
		var theElement = document.getElementById(x);
		return theElement;
	}
	
	// Find value of selected radio button.
	function getSelectedRadio() {
		var radios = document.forms[0].genre;
		for (var i=0; i < radios.length; i++) {
			if (radios[i].checked) {
				genreValue = radios[i].value;
				genreChecked = radios[i];
			}
		}
	}
	
	// Find value of Flip Switch 'Favorite' 
	function getSliderValue() {
		if (favorite[0].value === "on") {
			favoriteValue = "Yes";
		} else {
			favoriteValue = "No";
		}
	}
	
	function storeData(key) {
		// Generate a new key if the item is new
		if(!key) {
			var id = Math.floor(Math.random()*100000001);
		} else {
			// Set the ID to the existing key if the item is being edited
			id = key;
		}
		getSelectedRadio();
		getSliderValue();
		// Gather up all the form field values and store in an object.
		// Object properties contain an array with the form label and input values
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

		// Data is saved into Local Storage
		// alert('Book is saved!');
	}	
	
	// Collection of functions used to clear the form
	
	function clearForm() {
		clearElements();
		$('#clearall').click();
	}
	
	function clearElements() {
		// Local variables
		var chkRadios = document.forms[0].genre;
		// Reset the selected value in Media Type
		if(ge('groups').value != "PickOne") {
			$('#groups option[value="PickOne"]').attr('selected', 'selected');
			console.log("Dropdown cleared");
		}
		// Clear Genre radios
		for (var i=0; i < chkRadios.length; i++) {
			if (chkRadios[i].checked) {
				var genreID = chkRadios[i].id;
			}
			console.log("Radios cleared");
		}
		$('#'+genreID).attr('checked',false).checkboxradio('refresh');
		$('#groups').selectmenu('refresh', true);
	}
	
	function showData() {
		var categoryName = urlObj.hash.replace(/.*category=/, ""),
			category = categoryData(categoryName),
			pageSelector = urlObj.hash.replace( /\#allitems?.*$/, "");
	}
	
	
	function showData_depricated() {
		//var makeDiv = $('#allItems').createElement('div');
		alert('Listing all items');
		var startDiv = $('#dynamicdata');
		
		//var makeDiv = startDiv.createElement('div');
		var makeDiv = startDiv.append(createDiv()).trigger("create")
		makeDiv.setAttribute('id', 'items');
		
		var makeList = document.createElement('ul');
		makeList.setAttribute('class', 'browse');
		makeList.setAttribute('data-role', 'listview');
		makeList.setAttribute('data-filter', 'true');
		makeList.setAttribute('id', 'itemslist');
		
		makeDiv.appendChild(makeList);
		startDiv.appendChild(makeDiv);
		// Below for-loop looks in Local Storage for data
		/*
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
		}*/
	}
	
	function checkUserData() {
		
		if(localStorage.length >= 1) {
			showData();
		} else {
			var chkData = confirm("No saved searches. Create sample data?");
			autoFillData();
			showData();
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
		var editText = "Edit Search";
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
		var deleteText = "Delete Search";
		deleteLink.addEventListener('click', deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	}
	
	// Validator
	
	bookForm.validate({
		// Fires if invalid values are detected in required fields
		invalidHandler: function(form, validator){
			errorslink.click();
			var output = '';
			for(var key in validator.submitted) {
				var label = $('label[for^="' + key + '"]').not('[generated]');
				var legend = label.closest('fieldset').find('.ui-controlgroup-label');
				var fieldName = legend.length ? legend.text() : label.text();
				output += '<li class="errorli">' + "You're missing the " + fieldName.toLowerCase() + "." + '</li>';
			};
			$('#geterrors ul').html(output);
			console.log(validator.submitted);
		},

		// Fires when form is submitted and there are no validation errors
		submitHandler: function() {
			storeData(this.key);
			resetForm($('#addmovieform'));
		}
	})
	
	$('.reset').click(function() {
		clearForm();
	})
	
	$('.viewall').click(function() {
		checkUserData()
	})
	
	
});