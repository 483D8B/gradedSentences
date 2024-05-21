# from bs4 import BeautifulSoup

# # Read the HTML from the file
# with open('index.html', 'r', encoding='utf-8') as f:
#     html = f.read()

# # Parse the HTML
# soup = BeautifulSoup(html, 'html.parser')

# # Find all <div> tags
# div_tags = soup.find_all('div')

# # Add the "exercise" class to the first <div> of each row and "answer" class to the second
# for i in range(0, len(div_tags), 2):
#     div_tags[i]['class'] = 'exercise'
#     if i+1 < len(div_tags):
#         div_tags[i+1]['class'] = 'answer'

# # Write the modified HTML back to the file
# with open('your_file.html', 'w', encoding='utf-8') as f:
#     f.write(str(soup))

# import csv
# import html
# import re

# # Open the CSV file
# with open('playgroundData.csv', 'r', encoding='utf-8') as csv_file:
#     csv_reader = csv.reader(csv_file, delimiter='\t')

#     # Open the output HTML file
#     with open('output.html', 'w', encoding='utf-8') as html_file:
#         # Write the start of the HTML document
#         html_file.write('<div id="container">\n')

#         # Iterate over each row in the CSV
#         for row in csv_reader:
#             # Start the exercise div
            
#             html_file.write(f'\t<div class="number" id="{html.escape(row[3])}">{html.escape(row[3])}</div>\n')

#             html_file.write('<div class="exercise">\n')

#             # Convert the furigana format to use the HTML <ruby> element
#             furigana = re.sub(r'(\w+)\s*\[(.*?)\]', r'<ruby>\1<rt>\2</rt></ruby>', row[1])

#             # Enclose each column in a div with the appropriate class and id
#             html_file.write(f'\t<div class="sentence">{html.escape(row[0])}</div>\n')
#             html_file.write(f'\t<div class="furigana">{furigana}</div>\n')
#             html_file.write(f'\t<div class="translation">{html.escape(row[2])}</div>\n') 

#             # End the exercise div
#             html_file.write('</div>\n')

#         # Write the end of the HTML document
#         html_file.write('</div>\n')
import csv
import html
import re

# Open the CSV file
with open('playgroundData.csv', 'r', encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter='\t')

    # Open the output HTML file
    with open('output.html', 'w', encoding='utf-8') as html_file:
        # Write the start of the HTML document
        html_file.write('<div id="container">\n')

        # Create a dictionary to store the first occurrence of each Kanji
        kanji_dict = {}

        # Iterate over each row in the CSV
        for row in csv_reader:
            # Start the exercise div
            html_file.write(f'\t<div class="number" id="{html.escape(row[3])}">{html.escape(row[3])}</div>\n')
            html_file.write('<div class="exercise">\n')

            # Convert the furigana format to use the HTML <ruby> element
            furigana = re.sub(r'(\w+)\s*\[(.*?)\]', r'<ruby>\1<rt>\2</rt></ruby>', row[1])

            # Check each character in the sentence
            first_kanji = None
            for char in row[0]:
                # If the character is a Kanji and it's the first occurrence, mark it
                if '\u4e00' <= char <= '\u9fff' and char not in kanji_dict:
                    kanji_dict[char] = True
                    if first_kanji is None:
                        first_kanji = char

            # Enclose each column in a div with the appropriate class and id
            if first_kanji is not None:
                html_file.write(f'\t<div class="sentence first elem_{first_kanji}">{html.escape(row[0])}</div>\n')
            else:
                html_file.write(f'\t<div class="sentence">{html.escape(row[0])}</div>\n')
            html_file.write(f'\t<div class="furigana">{furigana}</div>\n')
            html_file.write(f'\t<div class="translation">{html.escape(row[2])}</div>\n') 

            # End the exercise div
            html_file.write('</div>\n')

        # Write the end of the HTML document
        html_file.write('</div>\n')
