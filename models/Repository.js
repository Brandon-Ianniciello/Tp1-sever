
const fs = require('fs');
///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports = 
class Repository {
    constructor(objectsName) {
        this.objectsList = [];
        this.objectsFile = `./data/${objectsName}.json`;
        this.read();
    }
    read() {
        try{
            // Here we use the synchronus version readFile in order  
            // to avoid concurrency problems
            let rawdata = fs.readFileSync(this.objectsFile);
            // we assume here that the json data is formatted correctly
            this.objectsList = JSON.parse(rawdata);
        } catch(error) {
            if (error.code === 'ENOENT') {
                // file does not exist, it will be created on demand
                this.objectsList = [];
            }
        }
    }
    write() {
        // Here we use the synchronus version writeFile in order
        // to avoid concurrency problems  
        fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
        this.read();
    }
    nextId() {
        let maxId = 0;
        for(let object of this.objectsList){
            if (object.Id > maxId) {
                maxId = object.Id;
            }
        }
        return maxId + 1;
    }
    add(object) {
        try {
            object.Id = this.nextId();
            this.objectsList.push(object);
            this.write();
            return object;
        } catch(error) {
            return null;
        }
    }
    getAll() {
        return this.objectsList;
    }
    get(id){
        for(let object of this.objectsList){
            if (object.Id === id) {
               return object;
            }
        }
        return null;
    }
    getByName(name){
        for(let object of this.objectsList){
            if(object.Name.toLowerCase() == name){
                return object;
            }
        }
        return null;
    }
    getByCategorie(categorie){
        let array = [];
        console.log(categorie)
        for(let object of this.objectsList){
            if(object.Category.toLowerCase() === categorie.toLowerCase()){
                array.push(object);
            }
        }
        console.log(array);
        return array;
    }
    remove(id) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === id) {
                this.objectsList.splice(index,1);
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
    removeAll(){
        let index = 0;
        for(let object of this.objectsList){
            this.remove(object.Id)
            index++;
        }
    }
    update(objectToModify) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === objectToModify.Id) {
                this.objectsList[index] = objectToModify;
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
    sortByName(){
        let arrayByNames = [];
        for(let object of this.objectsList){
            arrayByNames[object.Id] = object.Name;
        }
        arrayByNames = arrayByNames.sort();
        let array = [];
        console.log(arrayByNames.length)
        for(let i = 0; i < arrayByNames.length; i++){
            for(let j = 0; j < this.objectsList.length; j++){
                if(arrayByNames[i] === this.objectsList[j].Name){
                    array[i] = this.objectsList[j];
                    j = this.objectsList.length;
                }
            }
        }
        return array;
    }
    sortByCategory(){
        let arrayByCat = [];
        for(let object of this.objectsList){
            arrayByCat[object.Id] = object.Category;
        }
        arrayByCat = arrayByCat.sort();
        let array = [];
        console.log(arrayByCat.length)
        for(let i = 0; i < arrayByCat.length; i++){
            for(let j = 0; j < this.objectsList.length; j++){
                if(arrayByCat[i] === this.objectsList[j].Category){
                    array[i] = this.objectsList[j];
                    j = this.objectsList.length;
                }
            }
        }
        return array;
    }

}