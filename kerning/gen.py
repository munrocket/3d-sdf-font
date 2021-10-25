import string, json
from PIL import Image, ImageFont, ImageDraw

image = Image.new(mode='RGB', size=(200, 65))
draw = ImageDraw.Draw(image)
font = ImageFont.truetype('./arciform.otf', 2)
kerning = {}
alphabet = 'abcdefghijklmnopqrstuvwxyz .!'

for c in alphabet:
  kerning[c] = draw.textlength(c, font)
  for c2 in alphabet:
    pair = c + c2
    l1 = draw.textlength(pair, font)
    l2 = draw.textlength(pair, font, features=['-kern'])
    if (l1 - l2 != 0):
      kerning[pair] = l1 - l2

with open('../src/kerning.js', 'w') as file:
  file.write('export default ')
  json.dump(kerning, file, indent=2)

# font = ImageFont.truetype("./arciform.otf", 50)
# draw.text((10, 10), "arcijgj", font=font)
# image.save("temp.png")
# image = Image.new(mode='RGB', size=(200, 65))
# draw = ImageDraw.Draw(image)
# draw.text((10, 10), "arcijgj", font=font, features=['-kern'])
# image.save("temp2.png")