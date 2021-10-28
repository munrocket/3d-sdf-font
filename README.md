# 3d-sdf-font

Arciform font type sdf generator

### Usage
Creating sdf for text `lick me!` from console
```
npm start lick me!
```
In your script
```
import { sdf } from '3d-sdf-font';
console.log(sdf('lick me!\nyes you!'))
```
In browser console
```
\\ copy-paste kerning.js json and assign it to variable kerning
let kerning = { 'a': ... }
\\ copy-paste index.js source code without import, export and console.log
let template = (sdf, scale, tx, ty, tz) => { ...
\\ print result
console.log(sdf('how vexingly\nquick daft\nzebras jump'));
```

### Add new symbol in font
Create new SDF according to 2pt font letter with origin at left bottom corner

### Update kerning table for font
Add new symbol in kerning alphabet and run `npm run gen` or
```
pip3 install pillow
cd kerning
python3 gen.py
```
