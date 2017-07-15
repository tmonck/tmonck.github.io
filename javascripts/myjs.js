var currentDate = new Date();
var myBirthDate = new Date(86,3,30)
var oldestBirthDate = new Date(2011,8,29)
var youngestBirthDate = new Date(2015,4,21)
var myAge = (currentDate - myBirthDate)/(1000*60*60*24*365)
var oldest = (currentDate - oldestBirthDate)/(1000*60*60*24*365)
var youngest = (currentDate - youngestBirthDate)/(1000*60*60*24*365)

document.getElementById("myAge").innerHTML = myAge.toFixed(0);
document.getElementById("oldestAge").innerHTML = oldest.toFixed(0);
document.getElementById("youngestAge").innerHTML = youngest.toFixed(0);