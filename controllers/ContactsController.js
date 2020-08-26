const Repository = require('../models/Repository');
const Controller = require('./Controller');

class ContactsController extends Controller {
    constructor(req, res){
        super(req, res);
        this.contactsRepository = new Repository('Contacts');
    }
    getAll(){
        this.response.JSON(this.contactsRepository.getAll());
    }
    get(id){
        if(!isNaN(id))
            this.response.JSON(this.contactsRepository.get(id));
        else
            this.response.JSON(this.contactsRepository.getAll());
    }
    post(contact){  
        // todo : validate contact before insertion
        // todo : avoid duplicates
        let newContact = this.contactsRepository.add(contact);
        if (newContact)
            this.response.created(JSON.stringify(newContact));
        else
            this.response.internalError();
    }
    put(contact){
        // todo : validate contact before insertion
        if (this.contactsRepository.update(contact))
            this.response.ok();
        else 
            this.response.notFound();
    }
    remove(id){
        if (this.contactsRepository.remove(id))
            this.response.accept();
        else
            this.response.notFound();
    }
}

module.exports = ContactsController;