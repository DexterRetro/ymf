const ReadText = require('text-from-image')

ReadText('.blogPictures/id(1).jpeg').then(text => {
    console.log(text);
}).catch(err => {
    console.log(err);
});