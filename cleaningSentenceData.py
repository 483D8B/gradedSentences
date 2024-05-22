import csv
import html
import re

# Open the CSV file
with open('playgroundData.csv', 'r', encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter='\t')

    # Open the output HTML file
    with open('output.js', 'w', encoding='utf-8') as js_file:
        # Write the start of the HTML document
        js_file.write('document.getElementById("container").innerHTML = `\n')

        # Create a dictionary to store the first occurrence of each Kanji
        kanji_dict = {}
        
        counter = 0
        sub_counter = 1

        # Iterate over each row in the CSV
        for row in csv_reader:
            sub_counter += 1

            # Check each character in the sentence
            first_kanji = None
            for char in row[0]:
                # If the character is a Kanji and it's the first occurrence, mark it
                if '\u4e00' <= char <= '\u9fff' and char not in kanji_dict:
                    kanji_dict[char] = True
                    if first_kanji is None:
                        first_kanji = char
                        counter += 1
                        sub_counter = 1
                        
                        
             # Start the exercise div
            if (first_kanji != None):
                js_file.write(f'\t<div class="number" id="{html.escape(row[3])}">{counter}.{sub_counter}&nbsp;&nbsp;&nbsp;{first_kanji}</div>\n')
            else:
                js_file.write(f'\t<div class="number" id="{html.escape(row[3])}">{counter}.{sub_counter}</div>\n')
            js_file.write('<div class="exercise">\n')

            # Convert the furigana format to use the HTML <ruby> element
            furigana = re.sub(r'(\w+)\s*\[(.*?)\]', r'<ruby>\1<rt>\2</rt></ruby>', row[1])            
            

            # Enclose each column in a div with the appropriate class and id
            if first_kanji is not None:
                js_file.write(f'\t<div class="sentence first elem_{first_kanji}">{html.escape(row[0])}</div>\n')
            else:
                js_file.write(f'\t<div class="sentence">{html.escape(row[0])}</div>\n')
            js_file.write(f'\t<div class="furigana">{furigana}</div>\n')
            js_file.write(f'\t<div class="translation">{html.escape(row[2])}</div>\n') 

            # End the exercise div
            js_file.write('</div>\n')

        # Write the end of the HTML document
        js_file.write('</div>\n')
        
        js_file.write('`;\n')


