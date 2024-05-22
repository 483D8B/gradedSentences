window.onload = function () {
    // Get all furigana and translation elements
    var furiganas = document.getElementsByClassName('furigana');
    var translations = document.getElementsByClassName('translation');

    // Add 'Show with furigana' text and click event to all furigana elements
    for (let i = 0; i < furiganas.length; i++) {
        let originalText = furiganas[i].innerHTML;
        furiganas[i].innerText = 'Show with furigana';
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
wanakana.bind(searchInput, { IMEMode: 'toKana' });

function searchFunction() {
    // Declare variables
    var input, filters, container, exercises, sentence, number, i, j, txtValue;
    input = document.getElementById('search');
    filters = input.value.split(' ').map(word => wanakana.toHiragana(word.toUpperCase()));
    container = document.getElementById("container");
    exercises = container.getElementsByClassName('exercise');

    // Loop through all exercise items
    for (i = 0; i < exercises.length; i++) {
        sentence = exercises[i].getElementsByClassName("sentence")[0];
        number = exercises[i].previousElementSibling; // get the previous sibling element which is the number
        txtValue = sentence.textContent || sentence.innerText;
        var matched = false;

        // remove the highlighting
        sentence.innerHTML = txtValue.replace(/<span class="underline">(.*?)<\/span>/gi, '$1');

        // Loop through all filters
        for (j = 0; j < filters.length; j++) {
            if (filters[j] && wanakana.toHiragana(txtValue.toUpperCase()).indexOf(filters[j]) > -1) {
                matched = true;
                // underline the matched content
                sentence.innerHTML = sentence.innerHTML.replace(new RegExp(filters[j], 'gi'), '<span class="underline">$&</span>');
            }
        }

        if (matched || !input.value) {
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
            searchInput.value = this.textContent; // Set input value to Kanji
            searchInput.dispatchEvent(new Event('keyup')); // Manually trigger the keyup event
        };
        container.appendChild(kanjiDiv);
    }
}, 300); // 300 milliseconds debounce time
