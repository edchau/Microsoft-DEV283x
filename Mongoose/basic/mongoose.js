const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

let Book = mongoose.model('Book', { name: String })

let practicalNodeBook = new Book({ name: 'Practical Node.js' });
practicalNodeBook.save((err, results) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log('Saved: ', results)
    process.exit(0)
  }
})