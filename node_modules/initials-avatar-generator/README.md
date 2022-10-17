# initials-avatar-generator
Generates avatars with initials (or random text).

## Getting started
Install `imagemagick`

```
brew install imagemagick
```

then install this package through npm:

```
npm install initials-avatar-generator --save

```

How to use this code:

```javascript
var AvatarGenerator = require('initials-avatar-generator').AvatarGenerator;

var option = {
    width: 100,
    text: 'JL',
    color: '#FF0000'
  };
  var avatarGenerator = new AvatarGenerator();
  avatarGenerator.generate(option, function (image) {
    image //image is ImageMagick object - you can do whatever you want with it!
      .stream('png') // make a stream out of it
      .pipe(res); //pipe it to output, or maybe a file?
  });
```

## Configuration options

width - width & height of the image
text - your initials or any other text
color - color of the background
font - font to use - options are `bariol` or `din`
fontColor - color of the text
fontSize - size of the text
shape - shape of the avatar - options are `square` (default) or `circle`

## License

The MIT License (MIT)

Copyright (c) 2015 Jakub Leśniak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

