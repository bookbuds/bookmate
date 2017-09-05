module.exports = function parseUsersBooks(results) {
	let userInfo = {}
	let bookCollection = {}
	let reading = []
	let read = []
	let wantToRead = []

	userInfo.profile_img_url = results.length > 0 ? results[0]['profile_img_url'] : results['profile_img_url']
	userInfo.UserId = results.length > 0 ? results[0]['Books.UserBook.UserId'] : results['Books.UserBook.UserId']

	for (var index = 0; index < results.length; index++) {
		var element = results[index];
		
		let book = {}
		book.title = element['Books.title']
		book.author = element['Books.author']
		book.img_url = element['Books.img_url']
		book.bookId = element['Books.UserBook.BookId']

		let status = element['Books.UserBook.status']
		switch (status) {
			case 'read':
				read.push(book)
				break;
		
			case 'reading':
				reading.push(book)
				break;
			
			case 'wantToRead':
				wantToRead.push(book)
				break;
			default:
				break;
		}
		
	}

	bookCollection.read = read
	bookCollection.reading = reading
	bookCollection.wantToRead = wantToRead

	userInfo.bookCollection = bookCollection

	return userInfo
}