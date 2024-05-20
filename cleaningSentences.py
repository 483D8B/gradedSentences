from bs4 import BeautifulSoup

# Read the HTML from the file
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Parse the HTML
soup = BeautifulSoup(html, 'html.parser')

# Find all <div> tags
div_tags = soup.find_all('div')

# Add the "exercise" class to the first <div> of each row and "answer" class to the second
for i in range(0, len(div_tags), 2):
    div_tags[i]['class'] = 'exercise'
    if i+1 < len(div_tags):
        div_tags[i+1]['class'] = 'answer'

# Write the modified HTML back to the file
with open('your_file.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
