# 3d-sdf-font

Arciform font type sdf generator in glsl

![arciform](https://i.imgur.com/8wdqkK3.jpeg)

### Usage
Creating sdf for text `Hello world!` from console
```sh
npm start Hello\\nworld!
```
In your user script
```js
import { sdf } from '3d-sdf-font';
console.log(sdf('Hello\nworld!'))
```
In browser console
```js
\\ copypaste kerning.js json and assign it to variable kerning
let kerning = { 'a': ... };
\\ copypaste index.js source code without import, export and console.log
let template = (sdf, scale, tx, ty, tz) => { ... }
\\ print result
console.log(sdf('How vexingly\nquick daft\nzebras jump'));
```

### How to add new symbol in font
Create new SDF according to 2pt font letter with origin at left bottom corner in Inskape.
Add new symbol in kerning alphabet in `gen.py` and run `npm run gen` or
```sh
pip3 install pillow
cd kerning
python3 gen.py
```
