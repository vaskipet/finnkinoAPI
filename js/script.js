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

var time = new Date();
var h = time.getHours();
var m = time.getMinutes();

if (h < 10) { h = '0' + h }
if (m < 10) { m = '0' + m }
var time = h + ':' + m;
console.log(time);
// console.log(today);

//when the window loads these functions will fire
// the function fetches all the available theaters to user´s selcetion
window.onload = function() {

    //Adding images to an array
    var images = ['StarWars.jpg', 'TuntematonSotilas.jpg', 'TheForeigner.jpg', 'ABadMomsChristmas.jpg', 'Armomurhaaja.jpg', 'MuumienTaikatalvi.jpg', 'HeinahattuVilttitossu.jpg'];

    //jquery will randomize pictures in the big banner
    $('<img class="img-fluid d-none d-lg-block mt-5 ml-5" src="../img/' + images[Math.floor(Math.random() * images.length)] + '"/>').appendTo('#banner-load');

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

            var text = '';

            for (var i = 0; i < startTime.length; i++) {
                if (time < startTime[i].childNodes[0].nodeValue.slice(11, 16)) {
                    var movieitem = document.createElement('table'); //li alunperin
                    console.log(movieitem);
                    movieitem.className = 'leffalista';
                    movieitem.className = 'card text-center border-danger col-md-4 card-body';
                    // console.log('nomovies');
                    var leffat = document.getElementById('leffat');
                    var image = xmlDoc.getElementsByTagName('EventMediumImagePortrait');
                    var img = '<h4>' + titles[i].childNodes[0].nodeValue + '</h4>' +
                        '<img class="img-fluid w-50 mb-3 mx-auto" src="' + image[i].childNodes[0].nodeValue + '"/>' +
                        '<h6>' + theatre[i].childNodes[0].nodeValue + '</h6>' +
                        'The movie starts: ' + startTime[i].childNodes[0].nodeValue.slice(11, 16) + '<br>' +
                        'The movie ends: ' + endTime[i].childNodes[0].nodeValue.slice(11, 16) + '<br><hr>';
                    movieitem.innerHTML = img;

                    leffat.appendChild(movieitem);
                    console.log(leffat);
                }
            }
        }
    }
}

var search = document.getElementById('search');
search.addEventListener('keyup', function(e) {
    var term = e.target.value.toLowerCase(); //listens to what is written in the input and transforms it to lowercase
    console.log(term);
    var movies = document.getElementsByTagName('table'); //h4 toimii
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

// Refres hpage
function refreshPage() {
    location.reload();
}

// adding a smoother transition when clickin on links
$('a').click(function() {
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 500);
    return false;
})

$(document).ready(function() {
    $('#fader').click(function() {
        var $this = $(this);
        $('#searchsection').toggle('slow');

        $this.toggleClass('expanded');

        if ($this.hasClass('expanded')) {
            $this.html('Show the Searchbar');
        } else {
            $this.html('HIde the Searcbar');
        }
    })
})