exports.initBookmarks = function (){
    const BookmarksRepository = require('./Repository.js');
    const Bookmark = require('./bookmark.js');
    const bookmarkRepository = new BookmarksRepository("bookmarks");
    bookmarkRepository.add(new Bookmark('Google','https://www.google.ca/','Recherche'));
    bookmarkRepository.add(new Bookmark('Colnet','http://www.clg.qc.ca/colnet/','School'));
    bookmarkRepository.add(new Bookmark('New world','https://www.newworld.com/','Video games')); 
    bookmarkRepository.add(new Bookmark('League of legends','https://www.leagueoflegends.com/','Video games'));
    bookmarkRepository.add(new Bookmark('w3school', 'https://www.w3schools.com/','School'));
    //bookmarkRepository.removeAll();
}