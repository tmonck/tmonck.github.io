function setAge {
	var currentDate = new Date();
	var myBirthDate = new Date(86,3,30)
	var myAge = (currentDate - myBirthDate)/(1000*60*60*24*365)
	document.getElementById('age').innerHTML = myAge.toFixed(0);
}
