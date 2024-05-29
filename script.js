// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            console.log('Service Worker Registered. Scope is:' + registration.scope);
        });
}

window.onload = function () {
    // Get all furigana and translation elements
    var furiganas = document.getElementsByClassName('furigana');
    var translations = document.getElementsByClassName('translation');
    var notes = document.getElementsByClassName('notes');

    // Add 'Show with furigana' text and click event to all furigana elements
    for (let i = 0; i < furiganas.length; i++) {
        let originalText = furiganas[i].innerHTML;
        furiganas[i].innerText = 'Show with furigana';
        furiganas[i].dataset.originalText = originalText; // Store the original text in a data attribute
        // furiganas[i].style.userSelect = "none"; // Make the text non-selectable
        furiganas[i].addEventListener('click', function () {
            if (this.innerHTML == originalText) {
                this.innerText = 'Show with furigana';
                // this.style.userSelect = "none"; // Keep the text non-selectable
            } else {
                this.innerHTML = originalText;
                // this.style.userSelect = "auto"; // Make the text selectable after it's clicked
            }
        });
    }

    // Add 'Show translation' text and click event to all translation elements
    for (let i = 0; i < translations.length; i++) {
        let originalText = translations[i].innerHTML;
        translations[i].innerText = 'Show translation';
        // translations[i].style.userSelect = "none"; // Make the text non-selectable
        translations[i].addEventListener('click', function () {
            if (this.innerHTML == originalText) {
                this.innerText = 'Show translation';
                // this.style.userSelect = "none"; // Keep the text non-selectable
            } else {
                this.innerHTML = originalText;
                // this.style.userSelect = "auto"; // Make the text selectable after it's clicked
            }
        });
    }

    for (let i = 0; i < notes.length; i++) {
        let originalText = notes[i].innerHTML;
        notes[i].innerText = 'Show notes';
        // translations[i].style.userSelect = "none"; // Make the text non-selectable
        notes[i].addEventListener('click', function () {
            if (this.innerHTML == originalText) {
                this.innerText = 'Show notes';
                // this.style.userSelect = "none"; // Keep the text non-selectable
            } else {
                this.innerHTML = originalText;
                // this.style.userSelect = "auto"; // Make the text selectable after it's clicked
            }
        });
    }

    //not working as expected
    // // Get all sentence elements with the 'first' class
    // var sentences = document.querySelectorAll('.sentence.first');

    // // Loop through all sentence elements
    // for (let i = 0; i < sentences.length; i++) {
    //     // Get the original text
    //     let originalText = sentences[i].innerHTML;

    //     // Get the specific Kanji from the class list
    //     let kanji = sentences[i].classList[2].split('_')[1];

    //     // Create a regular expression to match the specific Kanji
    //     let regex = new RegExp(kanji, 'g');

    //     // Replace the specific Kanji with highlighted Kanji
    //     let highlightedText = originalText.replace(regex, function (match) {
    //         return '<span class="highlight">' + match + '</span>';
    //     });

    //     // Set the highlighted text
    //     sentences[i].innerHTML = highlightedText;
    // }

    // Get all exercise elements that contain a sentence with the 'first' class
    var exercises = document.querySelectorAll('.exercise .sentence.first');

    // Loop through all exercise elements
    for (let i = 0; i < exercises.length; i++) {
        // Get the preceding number div
        var numberDiv = exercises[i].parentElement.previousElementSibling;

        // Add a new class to the numberDiv
        numberDiv.classList.add('colouredNumber');
    }

    var numbers = document.querySelectorAll('#container .number');
    var lastNumber = numbers[numbers.length - 1];

    var counterDiv = document.getElementById('counter');

    counterDiv.innerHTML = lastNumber.id + ' <i class="fa-solid fa-language"></i>';


    // changeColor();



    // Store the initial visibility state of all elements
    var numbersVisibility = [];
    var exercisesVisibility = [];

    document.getElementById('showUnit').addEventListener('click', function () {
        // Get all elements with class 'number' and 'exercise'
        var numbers = document.getElementsByClassName('number');
        var exercises = document.getElementsByClassName('exercise');

        // Loop through all number elements
        for (var i = 0; i < numbers.length; i++) {
            // Store the initial visibility state
            numbersVisibility[i] = numbers[i].style.display;

            // If the element does not have the class 'colouredNumber', toggle its visibility
            if (!numbers[i].classList.contains('colouredNumber')) {
                if (numbers[i].style.display === 'none') {
                    numbers[i].style.display = '';
                } else {
                    numbers[i].style.display = 'none';
                }
            }
        }

        // Loop through all exercise elements
        for (var i = 0; i < exercises.length; i++) {
            // Store the initial visibility state
            exercisesVisibility[i] = exercises[i].style.display;

            if (exercises[i].style.display === 'none') {
                exercises[i].style.display = '';
            } else {
                exercises[i].style.display = 'none';
            }
        }
    });

    // Get all elements with the class colouredNumber
    var elements = document.getElementsByClassName('colouredNumber');

    // Add a double click event listener to each element
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function (e) {
            // Restore the visibility of all elements
            var numbers = document.getElementsByClassName('number');
            var exercises = document.getElementsByClassName('exercise');

            for (var i = 0; i < numbers.length; i++) {
                numbers[i].style.display = numbersVisibility[i];
            }

            for (var i = 0; i < exercises.length; i++) {
                exercises[i].style.display = exercisesVisibility[i];
            }

            // Scroll the page to the clicked element
            e.target.scrollIntoView({ behavior: "smooth" });
        });
    }


    if (navigator.share) {
        // Add an event listener to the share button// Add an event listener to all divs with class 'number'
        let numberDivs = document.getElementsByClassName('number');
        for (let i = 0; i < numberDivs.length; i++) {
            numberDivs[i].addEventListener('dblclick', function () {
                let numberElementId = this.id;

                openKanjiStudy(numberElementId);
                navigator.share({
                    text: numberElementId,
                })
                    .then(() => console.log('Successful share'))
                    .catch((error) => console.log('Error sharing', error));
            });
        }

    } else {
        console.log('Web Share API is not supported in this browser.');
    }





} //end onload function

document.getElementById('toggleButton').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    // Check if the body has the 'dark-mode' class
    if (document.body.classList.contains('dark-mode')) {
        // If it does, change the button text to 'Light Mode'
        this.innerText = 'Light Mode';
    } else {
        // If it doesn't, change the button text back to 'Dark Mode'
        this.innerText = 'Dark Mode';
    }
});


var searchInput = document.getElementById('search');
searchInput.focus();
// Set initial IMEMode to 'toHiragana'
var IMEMode = 'toHiragana';
wanakana.bind(searchInput, { IMEMode: IMEMode });

// Function to toggle IMEMode between 'toHiragana' and 'toKatakana'
function toggleIMEMode() {
    IMEMode = IMEMode === 'toHiragana' ? 'toKatakana' : 'toHiragana';
    wanakana.bind(searchInput, { IMEMode: IMEMode });
}


function searchFunction() {
    // Declare variables    
    var input, filters, container, exercises, sentence, number, i, j, txtValue;
    input = document.getElementById('search');
    filters = input.value.split(' ').map(word => {
        return IMEMode === 'toHiragana' ? wanakana.toHiragana(word) : wanakana.toKatakana(word);
    });
    container = document.getElementById("container");
    exercises = container.getElementsByClassName('exercise');
    //console.log(input.value);

    // If the input value is composed only of space characters, display all exercises and return
    if (/^\s*$/.test(input.value)) {
        for (i = 0; i < exercises.length; i++) {
            exercises[i].style.display = "";
            if (exercises[i].previousElementSibling) {
                exercises[i].previousElementSibling.style.display = ""; // show the number
            }
        }
        return;
    }

    // If the input value is not a space character, proceed with the usual search
    filters = input.value.split(' ').map(word => {
        return IMEMode === 'toHiragana' ? wanakana.toHiragana(word) : wanakana.toKatakana(word);
    });

    // Loop through all exercise items
    for (i = 0; i < exercises.length; i++) {
        sentence = exercises[i].getElementsByClassName("sentence")[0];
        number = exercises[i].previousElementSibling;
        txtValue = sentence.textContent || sentence.innerText;
        var matched = false;

        // remove the highlighting
        sentence.innerHTML = txtValue.replace(/<span class="underline">(.*?)<\/span>/gi, '$1');

        // Loop through all filters
        for (j = 0; j < filters.length; j++) {

            // Skip if the filter is an empty string
            if (filters[j] === '') continue;

            // Check both Hiragana and Katakana matches
            var hiraganaMatch = wanakana.toHiragana(txtValue).indexOf(wanakana.toHiragana(filters[j])) > -1;
            var katakanaMatch = wanakana.toKatakana(txtValue).indexOf(wanakana.toKatakana(filters[j])) > -1;

            if (hiraganaMatch || katakanaMatch) {
                matched = true;
                // underline the matched content
                var regex = new RegExp(`(${wanakana.toHiragana(filters[j])}|${wanakana.toKatakana(filters[j])})`, 'gi');
                sentence.innerHTML = sentence.innerHTML.replace(regex, '<span class="underline">$&</span>');
            }
        }

        if (matched || !input.value.trim()) {
            exercises[i].style.display = "";
            number.style.display = ""; // show the number
        } else {
            exercises[i].style.display = "none";
            number.style.display = "none"; // hide the number
        }
    }
}



var kanjiInput = document.getElementById('kanjiSearch');
wanakana.bind(kanjiInput, { IMEMode: 'toKana' });

// Create an index of Kanji by pronunciation
var kanjiIndex = {};
for (var i = 0; i < readings.length; i++) {
    var kanji = readings[i];
    kanji.ja_on.concat(kanji.ja_kun).forEach(pronunciation => {
        var hiragana = wanakana.toHiragana(pronunciation);
        if (!kanjiIndex[hiragana]) {
            kanjiIndex[hiragana] = [];
        }
        kanjiIndex[hiragana].push(kanji);
    });
}

function debounce(func, wait) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


var kanjiSearchFunction = debounce(function () {
    // Get the input value
    var input = document.getElementById('kanjiSearch');
    var filter = wanakana.toHiragana(input.value);


    // Look up the Kanji in the index
    var results = kanjiIndex[filter] || [];

    // If the filter is "まるばつ", add 〇 × to the results
    if (filter === 'まるばつ') {
        results.push({ literal: '〇' });
        results.push({ literal: '×' });
    }

    // Get the results container
    var container = document.getElementById('kanjiFoundContainer');

    // Clear the container
    container.innerHTML = '';

    // Add the results to the container
    for (var i = 0; i < results.length; i++) {
        var kanjiDiv = document.createElement('div');
        kanjiDiv.textContent = results[i].literal; // Display the matched Kanji
        kanjiDiv.classList.add('kanji'); // Add class for styling
        kanjiDiv.onclick = function () {
            var searchInput = document.getElementById('search');
            searchInput.value += this.textContent + ' '; // Set input value to Kanji
            input.value = '';
            searchInput.dispatchEvent(new Event('keyup')); // Manually trigger the keyup event
            input.dispatchEvent(new Event('keyup'));
            readingSearch.value += this.textContent + ' ';
            readingSearch.dispatchEvent(new Event('keyup'));
        };
        container.appendChild(kanjiDiv);
    }
}, 300); // 300 milliseconds debounce time



var readingInput = document.getElementById('readingSearch');

// Create an index of readings by Kanji
var readingIndex = {};
for (var i = 0; i < readings.length; i++) {
    var kanji = readings[i];
    kanji.ja_on.concat(kanji.ja_kun).forEach(pronunciation => {
        if (!readingIndex[kanji.literal]) {
            readingIndex[kanji.literal] = [];
        }
        readingIndex[kanji.literal].push(pronunciation);
    });
}
var readingSearchFunction = debounce(function () {
    // Get the input value
    var input = document.getElementById('readingSearch');
    var filter = input.value;

    // Split the input value into individual Kanji characters
    var kanjis = Array.from(filter);

    // Clear the container
    var container = document.getElementById('readingFoundContainer');
    container.innerHTML = '';

    // Define a color palette
    var colorPalette = ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'yellow', 'brown', 'cyan', 'magenta'];

    // Perform the search for each Kanji separately
    kanjis.forEach(function (kanji) {
        // Get the details of the Kanji character using the kanji.js library
        var kanjiDetails = Kanji.getDetails(kanji);

        if (kanjiDetails) {
            // Create a mapping of each reading to a unique color
            var readingToColor = {};
            kanjiDetails.kunyomi.concat(kanjiDetails.onyomi).forEach(function (reading, index) {
                readingToColor[reading] = colorPalette[index % colorPalette.length];
            });

            // Add the Kanji to the container
            var kanjiDiv = document.createElement('div');
            kanjiDiv.textContent = kanjiDetails.literal; // Display the Kanji
            kanjiDiv.classList.add('bo'); // Add class for styling
            container.appendChild(kanjiDiv);
            kanjiDiv.classList.add('break');

            // Add the results to the container
            for (var i = 0; i < kanjiDetails.kunyomi.concat(kanjiDetails.onyomi).length; i++) {
                var readingDiv = document.createElement('div');
                readingDiv.textContent = kanjiDetails.kunyomi.concat(kanjiDetails.onyomi)[i]; // Display the matched reading
                readingDiv.style.color = readingToColor[kanjiDetails.kunyomi.concat(kanjiDetails.onyomi)[i]]; // Set the color based on the reading
                readingDiv.classList.add('reading'); // Add class for styling
                container.appendChild(readingDiv);
            }
        }
    });
}, 300); // 300 milliseconds debounce time




document.getElementById('counter').addEventListener('click', function () {
    var container = document.getElementById('container');
    var x = container.getElementsByTagName("*");
    for (var i = 0; i < x.length; i++) {
        var y = Math.floor((Math.random() * 10) + 1);
        x[i].style.transform = "rotate(" + y + "deg)";
    }
});


document.getElementById('reset').addEventListener('click', function () {
    let x = document.getElementById('kanjiSearch')
    x.value = '';
    let y = document.getElementById('search');
    y.value = '';
    x.dispatchEvent(new Event('keyup'));
    y.dispatchEvent(new Event('keyup'));
});


function changeColor() {
    var elements = document.getElementsByClassName('colouredNumber');
    for (var i = 0; i < elements.length; i++) {
        var randomColor = generateAAAGradeColor();
        elements[i].style.backgroundColor = randomColor;
    }
}


function generateAAAGradeColor() {
    var color;
    do {
        color = '#' + ("000000" + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
    } while (!isAAAGrade(color));
    return color;
}


function isAAAGrade(color) {
    var rgb = hexToRgb(color);
    var brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128; // brightness range is 0-255, so anything over 128 will contrast well with black
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


// Function to open Kanji Study app
function openKanjiStudy(query) {
    window.location.href = 'kanjistudy://grs?id=' + query;
}
