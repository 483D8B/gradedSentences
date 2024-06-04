// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            console.log('Service Worker Registered. Scope is:' + registration.scope);

            // Check if there's an updated service worker waiting to take over
            if (registration.waiting) {
                updateServiceWorker(registration);
            }

            // Listen for new installing service worker
            registration.addEventListener('updatefound', function () {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', function () {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // New service worker is installed and waiting
                            updateServiceWorker(registration);
                        } else {
                            // No previous service worker, so this is the first one installed
                            console.log('Service Worker Installed for the first time.');
                        }
                    }
                });
            });
        });

    // Force the waiting service worker to become active
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        window.location.reload();
    });
}

function updateServiceWorker(registration) {
    if (confirm("New version available. Update now?")) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
}
var toggleStyle = false;

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
        translations[i].dataset.originalText = originalText;
        // translations[i].style.userSelect = "none"; // Make the text non-selectable
        translations[i].addEventListener('click', function () {
            if (this.innerHTML == originalText) {
                this.innerText = 'Show translation';
                // this.style.userSelect = "none"; // Keep the text non-selectable
            } else {
                this.innerHTML = this.dataset.originalText;
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



    function toggleElementVisibility(elements, visibilityArray) {
        for (var i = 0; i < elements.length; i++) {
            visibilityArray[i] = elements[i].style.display;
            if (!elements[i].classList.contains('colouredNumber')) {
                elements[i].style.display = elements[i].style.display === 'none' ? '' : 'none';
            }
        }
    }

    function restoreElementVisibility(elements, visibilityArray) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = visibilityArray[i];
        }
    }

    document.getElementById('showUnit').addEventListener('click', function () {
        var numbers = document.getElementsByClassName('number');
        var exercises = document.getElementsByClassName('exercise');
        var container = document.getElementById('container');
        var kHeaders = document.getElementsByClassName('kanjiHeader');
        var cHeaders = document.getElementsByClassName('counter');

        // Clear the search fields and dispatch the 'input' event
        ['search', 'kanjiSearch', 'readingSearch', 'furiganaSearch'].forEach(function (id) {
            var inputField = document.getElementById(id);
            if (inputField.value != '') {
                var event = new Event('keyup', { bubbles: true });
                inputField.value = '';
                inputField.dispatchEvent(event);
            }
        });

        container.style.flexWrap = toggleStyle ? 'nowrap' : 'wrap';
        container.style.flexDirection = toggleStyle ? 'column' : 'row';
        toggleStyle ? container.classList.add('aspect-ratio-1-1') : container.classList.remove('aspect-ratio-1-1');

        var width = toggleStyle ? '94.5vw' : '3em';
        var display = toggleStyle ? 'inline-block' : 'table';

        Array.from(numbers).forEach(number => number.style.width = width);
        Array.from(kHeaders).concat(Array.from(cHeaders)).forEach(header => header.style.display = display);

        toggleStyle = !toggleStyle;

        // Update the visibility state
        numbersVisibility = Array.from(numbers).map(number => number.style.display);
        exercisesVisibility = Array.from(exercises).map(exercise => exercise.style.display);

        toggleElementVisibility(numbers, numbersVisibility);
        toggleElementVisibility(exercises, exercisesVisibility);

    });


    Array.from(document.getElementsByClassName('colouredNumber')).forEach(element => {
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            let textToCopy = element.textContent;
            let kanjiToCopy = textToCopy.replace(/[\d-]/g, ''); // Remove digits and hyphens

            let readingField = document.getElementById('readingSearch');
            readingField.value += kanjiToCopy + ' ';
            readingField.dispatchEvent(new Event('keyup'));

        });

        element.addEventListener('click', function (e) {
            var numbers = document.getElementsByClassName('number');
            var exercises = document.getElementsByClassName('exercise');
            var container = document.getElementById('container');
            var kHeaders = document.getElementsByClassName('kanjiHeader');
            var cHeaders = document.getElementsByClassName('counter');

            // Restore the visibility of all elements
            Array.from(numbers).forEach(number => number.style.display = '');
            Array.from(exercises).forEach(exercise => exercise.style.display = '');

            // Reset the styles
            container.style.flexWrap = 'nowrap';
            container.style.flexDirection = 'column';
            container.classList.add('aspect-ratio-1-1');

            Array.from(numbers).forEach(number => number.style.width = '94.5vw');
            Array.from(kHeaders).concat(Array.from(cHeaders)).forEach(header => header.style.display = 'inline-block');

            toggleStyle = false;

            e.target.scrollIntoView({ behavior: "smooth" });
        });
    });




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



    var toggleStateTranslation = false;

    document.getElementById('toggleAllTranslations').addEventListener('click', function () {
        var translations = document.getElementsByClassName('translation');
        if (!toggleStateTranslation) {
            for (let i = 0; i < translations.length; i++) {
                translations[i].innerHTML = translations[i].dataset.originalText;
            }
            toggleStateTranslation = true;
        } else {
            for (let i = 0; i < translations.length; i++) {
                translations[i].innerHTML = 'Show translation';
            }
            toggleStateTranslation = false;
        }
    });


    var toggleStateFurigana = false;

    document.getElementById('toggleAllFurigana').addEventListener('click', function () {
        var furigana = document.getElementsByClassName('furigana');
        if (!toggleStateFurigana) {
            for (let i = 0; i < furigana.length; i++) {
                furigana[i].innerHTML = furigana[i].dataset.originalText;
            }
            toggleStateFurigana = true;
        } else {
            for (let i = 0; i < furigana.length; i++) {
                furigana[i].innerHTML = 'Show with furigana';
            }
            toggleStateFurigana = false;
        }
    });






} //end onload function

document.getElementById('toggleMode').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    // Check if the body has the 'dark-mode' class
    if (document.body.classList.contains('dark-mode')) {
        // If it does, change the button text to 'Light Mode'
        this.innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
    } else {
        // If it doesn't, change the button text back to 'Dark Mode'
        this.innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
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
    const input = document.getElementById('search');
    const container = document.getElementById("container");
    const exercises = container.getElementsByClassName('exercise');

    let filters = input.value.split(' ').map(word => IMEMode === 'toHiragana' ? wanakana.toHiragana(word) : wanakana.toKatakana(word));

    // Mapping from Western numbers to Japanese kanji numbers
    const numberMapping = {
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七",
        "8": "八",
        "9": "九",
        "10": "十"
    };

    // Reverse mapping from Japanese kanji numbers to Western numbers
    let reverseNumberMapping = {};
    for (let key in numberMapping) {
        reverseNumberMapping[numberMapping[key]] = key;
    }

    if (toggleStyle == false) {

        // Loop through all exercise items
        for (let i = 0; i < exercises.length; i++) {
            let sentence = exercises[i].getElementsByClassName("sentence")[0];
            let number = exercises[i].previousElementSibling;
            let txtValue = sentence.textContent || sentence.innerText;

            // remove the highlighting
            sentence.innerHTML = txtValue.replace(/<span class="underline">(.*?)<\/span>/gi, '$1');

            let matched = false;

            // If the input value is composed only of space characters, display all exercises and return
            if (/^\s*$/.test(input.value)) {
                exercises[i].style.display = "";
                if (exercises[i].previousElementSibling) {
                    exercises[i].previousElementSibling.style.display = ""; // show the number
                }
                continue;
            }

            // Loop through all filters
            for (let j = 0; j < filters.length; j++) {

                // Skip if the filter is an empty string
                if (filters[j] === '') continue;

                // Check both Hiragana and Katakana matches
                let hiraganaMatch = wanakana.toHiragana(txtValue).indexOf(wanakana.toHiragana(filters[j])) > -1;
                let katakanaMatch = wanakana.toKatakana(txtValue).indexOf(wanakana.toKatakana(filters[j])) > -1;

                // Check if the filter is a Western number and highlight the corresponding Japanese kanji number
                if (numberMapping[filters[j]] && txtValue.includes(numberMapping[filters[j]])) {
                    matched = true;
                    let regex = new RegExp(numberMapping[filters[j]], 'gi');
                    sentence.innerHTML = sentence.innerHTML.replace(regex, '<span class="underline">$&</span>');
                }

                // Check if the filter is a Japanese kanji number and highlight the corresponding Western number
                if (reverseNumberMapping[filters[j]] && txtValue.includes(reverseNumberMapping[filters[j]])) {
                    matched = true;
                    let regex = new RegExp(reverseNumberMapping[filters[j]], 'gi');
                    sentence.innerHTML = sentence.innerHTML.replace(regex, '<span class="underline">$&</span>');
                }

                if (hiraganaMatch || katakanaMatch) {
                    matched = true;
                    // underline the matched content
                    let regex = new RegExp(`(${wanakana.toHiragana(filters[j])}|${wanakana.toKatakana(filters[j])})`, 'gi');
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
    if (!readingIndex[kanji.literal]) {
        readingIndex[kanji.literal] = { onyomi: [], kunyomi: [] };
    }
    kanji.ja_on.forEach(pronunciation => {
        readingIndex[kanji.literal].onyomi.push(pronunciation);
    });
    kanji.ja_kun.forEach(pronunciation => {
        readingIndex[kanji.literal].kunyomi.push(pronunciation);
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

    // Perform the search for each Kanji separately
    kanjis.forEach(function (kanji) {
        // Get the details of the Kanji character from the readings array
        var kanjiDetails = readings.find(function (reading) {
            return reading.literal === kanji;
        });

        if (kanjiDetails) {
            // Add the Kanji to the container
            var kanjiDiv = document.createElement('div');
            kanjiDiv.textContent = kanji; // Display the Kanji
            container.appendChild(kanjiDiv);
            kanjiDiv.classList.add('break');
            kanjiDiv.setAttribute('data-content', kanji);
            kanjiDiv.textContent = '';

            // Add the onyomi readings to the container
            for (var i = 0; i < kanjiDetails.ja_on.length; i++) {
                var readingDiv = document.createElement('div');
                readingDiv.textContent = kanjiDetails.ja_on[i]; // Display the matched reading
                readingDiv.classList.add('onyomi');
                readingDiv.classList.add('reading'); // Add class for styling
                container.appendChild(readingDiv);
            }

            // Add the kunyomi readings to the container
            for (var i = 0; i < kanjiDetails.ja_kun.length; i++) {
                var readingDiv = document.createElement('div');
                readingDiv.textContent = kanjiDetails.ja_kun[i]; // Display the matched reading
                readingDiv.classList.add('kunyomi');
                readingDiv.classList.add('reading'); // Add class for styling
                container.appendChild(readingDiv);
            }
        }
    });
}, 300); // 300 milliseconds debounce time




var furiganaSearchInput = document.getElementById('furiganaSearch');
// Set initial IMEMode to 'toHiragana'
wanakana.bind(furiganaSearchInput, { IMEMode: IMEMode });


var furiganaSearchFunction = debounce(function () {
    const container = document.getElementById("container");
    const exercises = container.getElementsByClassName('exercise');
    const input = document.getElementById('furiganaSearch');
    const kanjiInput = document.getElementById('search');
    let filters = input.value.split(' ').map(word => IMEMode === 'toHiragana' ? wanakana.toHiragana(word) : wanakana.toKatakana(word));
    let kanjiFilters = kanjiInput.value.trim().split(' ');

    let matchCount = 0; // Initialize the counter

    // Define an array of colors for highlighting
    let colors = ['red', 'blue', 'green', 'purple', 'orange'];

    if (kanjiInput.value != '') {



        // Loop through all exercise items
        for (let i = 0; i < exercises.length; i++) {
            let furigana = exercises[i].getElementsByClassName("furigana")[0];
            let sentence = exercises[i].getElementsByClassName("sentence")[0];
            let txtValue = furigana.dataset.originalText; // Use the original text stored in data attribute
            let number = exercises[i].previousElementSibling;
            let matched = false;

            // Create a temporary div element and set its innerHTML to the original text
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = txtValue;

            // Extract the text inside the <ruby> tags
            let rubyText = '';
            let rubyElements = tempDiv.getElementsByTagName('ruby');
            for (let j = 0; j < rubyElements.length; j++) {
                rubyText += rubyElements[j].textContent;
            }

            // If the input value is composed only of space characters, display all exercises and return
            if (/^\s*$/.test(input.value) && /^\s*$/.test(kanjiInput.value)) {
                exercises[i].style.opacity = "1";
                if (exercises[i].previousElementSibling) {
                    exercises[i].previousElementSibling.style.opacity = "1"; // show the number
                }
                continue;
            }

            // Loop through all kanji filters
            for (let k = 0; k < kanjiFilters.length; k++) {
                let kanjiFilter = kanjiFilters[k];

                // Check if the kanji filter is present in the original text
                let kanjiMatch = rubyText.indexOf(kanjiFilter) > -1;

                // Loop through all filters
                for (let j = 0; j < filters.length; j++) {

                    // Skip if the filter is an empty string
                    if (filters[j] === '') continue;

                    // Check both Hiragana and Katakana matches
                    let hiraganaMatch = wanakana.toHiragana(rubyText).indexOf(wanakana.toHiragana(filters[j])) > -1;
                    let katakanaMatch = wanakana.toKatakana(rubyText).indexOf(wanakana.toKatakana(filters[j])) > -1;

                    if ((hiraganaMatch || katakanaMatch) && kanjiMatch) {
                        matched = true;
                        // underline the matched content with a specific color
                        let regex = new RegExp(`(${kanjiFilter})`, 'gi');
                        sentence.innerHTML = sentence.innerHTML.replace(regex, `<span class="underline" style="color: ${colors[j % colors.length]}">$&</span>`);
                    }
                }
            }

            if (matched || (!input.value.trim() && kanjiFilters.some(kanjiFilter => rubyText.indexOf(kanjiFilter) > -1))) {
                exercises[i].style.opacity = "1";
                number.style.opacity = "1"; // show the number
                matchCount++; // Increment the counter
            } else {
                exercises[i].style.opacity = "0.3";
                number.style.opacity = "0.3"; // decrease the opacity
            }
        }

        document.getElementById("filteredNumber").innerText = matchCount

    }

}, 300); // 300 milliseconds debounce time



document.getElementById('counter').addEventListener('click', function () {

    // console.log(kanji.getDetails('明'));
    var exercises = document.querySelectorAll('.exercise');
    exercises.forEach(function (exercise) {
        exercise.style.borderTop = '2px solid black';
    });
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
