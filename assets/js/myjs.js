const currentDate = new Date();
const myBirthDate = new Date(86,3,30);
const oldestBirthDate = new Date(2011,8,29);
const youngestBirthDate = new Date(2015,4,21);
const myAge = (currentDate - myBirthDate)/(1000*60*60*24*365);
const oldest = (currentDate - oldestBirthDate)/(1000*60*60*24*365);
const youngest = (currentDate - youngestBirthDate)/(1000*60*60*24*365);
const programmingLanguages = ['C#', 'Javascript', 'Python', 'Java'];
programmingLanguages.forEach(function(language, index) {
    if (index === programmingLanguages.length - 1){
        document.getElementById("prgLang").innerHTML += `and ${language}`;
    } else {
        document.getElementById("prgLang").innerHTML += `${language}, `;
    }
});

document.getElementById("myAge").innerHTML = myAge.toFixed(0);
document.getElementById("oldestAge").innerHTML = oldest.toFixed(0);
document.getElementById("youngestAge").innerHTML = youngest.toFixed(0);
document.getElementById("numOfPrgLang").innerHTML = programmingLanguages.length;
