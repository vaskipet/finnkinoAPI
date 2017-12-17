//storing the current day into a variable that will be used later
// in the API´s URL
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
// variable "today" will be used in the API URL later on
var today = dd + '.' + mm + '.' + yyyy;

// another variable that will be used later
// in order to check the time and fetch movies based on that
var time = new Date();
var h = time.getHours();
var m = time.getMinutes();

if (h < 10) { h = '0' + h }
if (m < 10) { m = '0' + m }
var time = h + ':' + m;

//when the window loads these functions will fire
//First the images will be loaded to the jumbotron
// the function fetches all the available theaters to user´s selection
window.onload = function() {

    //Adding images to an array
    var images = ['StarWars.jpg', 'TuntematonSotilas.jpg', 'TheForeigner.jpg', 'ABadMomsChristmas.jpg', 'Armomurhaaja.jpg', 'MuumienTaikatalvi.jpg', 'HeinahattuVilttitossu.jpg'];

    //jquery will randomize pictures in the big banner
    // not using the API for this, rather static pictures from img-folder
    $('<img class="img-fluid d-none d-lg-block mt-5 ml-5" src="../img/' + images[Math.floor(Math.random() * images.length)] + '"/>').appendTo('#banner-load');

    var url = 'http://www.finnkino.fi/xml/TheatreAreas/';

    // creating XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    // handling the response
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {

            // creating the necessary variables
            var xmlDoc = xhr.responseXML;
            var area = xmlDoc.getElementsByTagName('ID');
            var name = xmlDoc.getElementsByTagName('Name');
            var list = document.getElementById('select');

            // iterating through the array of theater names
            for (var i = 0; i < name.length; i++) {

                var option = document.createElement('option');
                option.value = area[i].firstChild.data;
                var optionText = document.createTextNode(name[i].firstChild.data);
                list.appendChild(option);
                // creating elements to the dropdown menu
                option.appendChild(optionText);
            }
        }
    }
}

// for displaying all the necessary information
function displayData() {

    var userSelection = document.getElementById('select').value;

    // creating XMLHttpRequest object
    var displayxhr = new XMLHttpRequest();
    displayxhr.open('GET', 'http://www.finnkino.fi/xml/Schedule/?area=' + userSelection + '&dt=' + today, true);
    displayxhr.send();

    displayxhr.onreadystatechange = function() {
        if (displayxhr.readyState == 4 && displayxhr.status == 200) {
            var xmlDoc = displayxhr.responseXML;
            // console.log(xmlDoc);
            // saving all the data into variables that we can use later in the scope of this function
            var titles = xmlDoc.getElementsByTagName('Title');
            var startTime = xmlDoc.getElementsByTagName('dttmShowStart');
            var endTime = xmlDoc.getElementsByTagName('dttmShowEnd');
            var theatre = xmlDoc.getElementsByTagName('Theatre');
            var ratingImg = xmlDoc.getElementsByTagName('RatingImageUrl');
            var showUrl = xmlDoc.getElementsByTagName('ShowURL');
            // var image = xmlDoc.getElementsByTagName('EventMediumImagePortrait');
            var image = xmlDoc.getElementsByTagName('EventLargeImagePortrait');

            // Error handling if the Finnkino has not updated all the images
            if (image.length != titles.length) {
                var warning = document.createElement('table');
                warning.className = 'leffalista';
                warning.className = 'card text-center border-danger col-md-4 card-body warning text-white';
                var leffat = document.getElementById('leffat');
                // The first item in the list is going to be a warning box with red background and white warning-text
                var warningText = '<h2> There is something wrong with the API!</h2><br><br>Not all of the images are displayed correctly at the moment. You can reset your search and try another smaller theater or come back at a later hour.';
                warning.innerHTML = warningText;
                leffat.appendChild(warning);
            }
            // if everything is okay then we will display the information for the user
            for (var i = 0; i < startTime.length; i++) {
                if (time < startTime[i].childNodes[0].nodeValue.slice(11, 16)) { //slicing the value so that it´s the same as the format in variable time
                    var movieitem = document.createElement('table'); //li alunperin
                    // console.log(movieitem);
                    movieitem.className = 'leffalista';
                    movieitem.className = 'card text-center border-dark col-md-4 card-body';
                    var leffat = document.getElementById('leffat');
                    var img = '<h4>' + titles[i].childNodes[0].nodeValue + '<img style="width: 25px;" src="' + ratingImg[i].childNodes[0].nodeValue + '"/></h4>' +
                        '<img class="img-fluid w-50 mb-3 mx-auto" src="' + image[i].childNodes[0].nodeValue + '"/>' +
                        '<h6>' + theatre[i].childNodes[0].nodeValue + '</h6>' +
                        'The movie starts: ' + startTime[i].childNodes[0].nodeValue.slice(11, 16) + '<br>' +
                        'The movie ends: ' + endTime[i].childNodes[0].nodeValue.slice(11, 16) + '<br>' +
                        '<button class="btn btn-default"> <a href="' + showUrl[i].childNodes[0].nodeValue + '">Book it! </a></button><hr>';
                    movieitem.innerHTML = img;
                    // finally appending the information to the correct place on the page by appending
                    leffat.appendChild(movieitem);
                }
            }
        }
    }
}

// the search functionality
var search = document.getElementById('search');
search.addEventListener('keyup', function(e) {
    var term = e.target.value.toLowerCase(); //listens to what is written in the input and transforms it to lowercase
    // console.log(term);
    var movies = document.getElementsByTagName('table'); //h4 toimii
    // var movies = document.getElementsByClassName('leffalista'); //testi
    Array.from(movies).forEach(function(movie) {
        var title = movie.firstChild.textContent;
        // console.log(title);
        if (title.toLowerCase().indexOf(term) != -1) {
            movie.style.display = 'block';
        } else {
            movie.style.display = 'none';
        }
    })
})

// Refresh page so that the search results are resetted
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

// cool jquery effect to hide the searchbar
$(document).ready(function() {
    $('#fader').click(function() {
        var $this = $(this);
        $('#searchsection').toggle('slow');

        // toggling the class of the item when clicking it
        $this.toggleClass('expanded');

        // if the class is 'expanded' then the text is 'Show the Searchbar'
        if ($this.hasClass('expanded')) {
            $this.html('Show the Searchbar');
        } else {
            // else it´s Hide the Searchbar
            $this.html('Hide the Searcbar');
        }
    })
})