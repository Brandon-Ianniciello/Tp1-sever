const Repository = require('../models/Repository');

module.exports =
    class BookmarksController extends require('./Controller') {
        constructor(req, res) {
            super(req, res);
            this.bookmarksRepository = new Repository('Bookmarks');
        }
        getAll() {

            this.response.JSON(this.bookmarksRepository.getAll());
        }
        get(id) {
            console.log("id:"+id)
            if (id !== undefined) {
                console.log('dans le if')
                this.response.JSON(this.bookmarksRepository.get(id))
            } else {
                let param = this.getQueryStringParams();
                let nbParam = 0;

                if (param !== null) {
                    nbParam = Object.keys(param).length;
                }

                if (nbParam === 0) {
                    this.getAll()
                } else {
                    if (param['name'] != null) {
                        this.getByName(param['name'].toLowerCase());
                    }
                    if (param['sort'] != null) {
                        let sort = param['sort'];
                        if (sort === 'name') {
                            this.response.JSON(this.bookmarksRepository.sortByName());
                        }
                        if (sort === 'category') {
                            this.response.JSON(this.bookmarksRepository.sortByCategory());
                        }
                    }
                    if (param['category'] != null) {
                        let category = param['category'];
                        this.response.JSON(this.bookmarksRepository.getByCategorie(category))
                    }
                }
            }



        }
        getByCategory(category) {
            this.response.JSON(this.bookmarksRepository.getByCategorie(category));
        }
        getByName(name) {
            this.response.JSON(this.bookmarksRepository.getByName(name))
        }
        post(bookmark) {
            // todo : validate contact before insertion
            // todo : avoid duplicates
            let newBookmark = this.bookmarksRepository.add(bookmark);
            if (newBookmark)
                this.response.created(JSON.stringify(newBookmark));
            else
                this.response.internalError();
        }
        put(bookmark) {
            // todo : validate contact before updating
            if (this.bookmarksRepository.update(bookmark))
                this.response.ok();
            else
                this.response.notFound();
        }
        remove(id) {
            if (this.bookmarksRepository.remove(id))
                this.response.accepted();
            else
                this.response.notFound();
        }
    }