//storing the current day into a variable that will be used later
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
// variable "today" will be used in the URL later on
var today = dd + '.' + mm + '.' + yyyy;

var today2 = new Date();
var h = today2.getHours();
var m = today2.getMinutes();

if (h < 10) { h = '0' + h }
if (m < 10) { m = '0' + m }
var today2 = h + ':' + m;
console.log(today2);
// console.log(today);

//when the window loads this function will fire
// the function fetches all the available theaters to user´s selcetion
window.onload = function() {
    var url = 'http://www.finnkino.fi/xml/TheatreAreas/';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {

            var xmlDoc = xhr.responseXML;
            var area = xmlDoc.getElementsByTagName('ID');
            var name = xmlDoc.getElementsByTagName('Name');
            var list = document.getElementById('select');

            for (var i = 0; i < name.length; i++) {
                // console.log(name[i]);
                var option = document.createElement('option');
                option.value = area[i].firstChild.data;
                var optionText = document.createTextNode(name[i].firstChild.data);
                list.appendChild(option);
                option.appendChild(optionText);
            }
        }
    }
}

function displayData() {
    // var date = getDate();
    var userSelection = document.getElementById('select').value;


    var displayxhr = new XMLHttpRequest();
    displayxhr.open('GET', 'http://www.finnkino.fi/xml/Schedule/?area=' + userSelection + '&dt=' + today, true);
    displayxhr.send();
    console.log(userSelection);

    displayxhr.onreadystatechange = function() {
        if (displayxhr.readyState == 4 && displayxhr.status == 200) {
            var xmlDoc = displayxhr.responseXML;
            console.log(xmlDoc);
            var titles = xmlDoc.getElementsByTagName('Title');
            var startTime = xmlDoc.getElementsByTagName('dttmShowStart');
            var endTime = xmlDoc.getElementsByTagName('dttmShowEnd');
            var theatre = xmlDoc.getElementsByTagName('Theatre');

            // console.log(movieitem);
            // displayin the information in a variable 
            // var text = '<ul id="leffa-list" style="list-style-type: none;" class="mt-5">';
            var text = '';

            for (var i = 0; i < startTime.length; i++) {
                if (today2 < startTime[i].childNodes[0].nodeValue.slice(11, 16)) {
                    var movieitem = document.createElement('li');
                    console.log(movieitem);
                    movieitem.className = 'leffalista';
                    movieitem.className = 'card text-center border-primary col-md-4 card-body';
                    // console.log('nomovies');
                    var leffat = document.getElementById('leffat');
                    var image = xmlDoc.getElementsByTagName('EventMediumImagePortrait');
                    var img = '<h4>' + titles[i].childNodes[0].nodeValue + '</h4>' +
                        '<img class="img-fluid w-50 mb-3 mx-auto" src="' + image[i].childNodes[0].nodeValue + '"/>' +
                        '<h6>' + theatre[i].childNodes[0].nodeValue + '</h6>' +
                        'Elokuva alkaa kello: ' + startTime[i].childNodes[0].nodeValue.slice(11, 16) + '<br>' +
                        'Elokuva päättyy kello: ' + endTime[i].childNodes[0].nodeValue.slice(11, 16) + '<br><hr>';
                    movieitem.innerHTML = img;
                    // movieitem.appendChild(document.createTextNode(image[i].childNodes[0].nodeValue));
                    // movieitem.appendChild(document.createTextNode(img));
                    // movieitem.appendChild(img);

                    leffat.appendChild(movieitem);
                    console.log(leffat);
                    // text += '<li><h4>' + titles[i].childNodes[0].nodeValue + '</h4>' +
                    //     '<img src="' + image[i].childNodes[0].nodeValue + '"/>' +
                    //     // '<h4>' + titles[i].childNodes[0].nodeValue + '</h4>' +
                    //     '<h6>' + theatre[i].childNodes[0].nodeValue + '</h6><br>' +
                    //     'Elokuva alkaa kello: ' + startTime[i].childNodes[0].nodeValue.slice(11, 16) + '<br>' +
                    //     'Elokuva päättyy kello: ' + endTime[i].childNodes[0].nodeValue.slice(11, 16) + '</li><br><hr>';
                    // document.getElementById('leffat').innerHTML = '</ul>' + text;
                }
            }
        }
    }
}

var search = document.getElementById('search');
search.addEventListener('keyup', function(e) {
    var term = e.target.value.toLowerCase(); //listens to what is written in the input and transforms it to lowercase
    console.log(term);
    var movies = document.getElementsByTagName('li'); //h4 toimii
    // var movies = document.getElementsByClassName('leffalista'); //testi
    Array.from(movies).forEach(function(movie) {
        var title = movie.firstChild.textContent;
        console.log(title);
        if (title.toLowerCase().indexOf(term) != -1) {
            movie.style.display = 'block';
        } else {
            movie.style.display = 'none';
        }
    })
})