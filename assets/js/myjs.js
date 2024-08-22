const currentDate = new Date();
const myBirthDate = new Date(86,3,30);
const myAge = (currentDate - myBirthDate)/(1000*60*60*24*365);
const programmingLanguages = ['Golang','C#', 'Javascript', 'Typescript', 'Python', 'Java'];
programmingLanguages.forEach(function(language, index) {
    if (index === programmingLanguages.length - 1){
        document.getElementById("prgLang").innerHTML += `and ${language}`;
    } else {
        document.getElementById("prgLang").innerHTML += `${language}, `;
    }
});

document.getElementById("myAge").innerHTML = myAge.toFixed(0);
document.getElementById("numOfPrgLang").innerHTML = programmingLanguages.length;
