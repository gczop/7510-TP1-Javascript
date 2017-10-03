var Interpreter = function () {

    var parsed_DB;
    var validDB;

    this.hasBasePattern = function(string){
        var factReg = /\w+\(\w+(, \w+)*\)./;
        return factReg.test(string);
    }
    /*
    this.isValidRule = function (string){
        var ruleRegex = /\w+\(\w+(,\ \w+)*\)\ \:\-\ (\w+\(\w+(,\ \w+)*\),\ )*./;
        return ruleRegex.test(string);
    }

    this.isValidFact = function (string){
        if(this.isValidRule(string)){
            return false;
        }

    }*/

    this.isValidDB = function(array){
        for(var i=0;i<array.length;i++){
            if(!this.hasBasePattern(array[i])){
                return false;
            }
        }
        return true;
    }

    this.removeDotsAndSpace = function(array){
        for(var i=0; i<array.length; i++){
            array[i].replace('.','');
            array[i].replace(' ','');
        }
        return array;
    }

    this.searchFact = function(fact, db) {
        for (var i = 0; i < db.length; i++) {
            if (fact === db[i]) {
                return true;
            }
        }
        return false;
    }

    this.parseDB = function (params, paramss, paramsss) {
        validDB = this.isValidDB(params);
        if (validDB == false){
            return;
        }
        parsed_DB = this.removeDotsAndSpace(params);
    }

    this.checkQuery = function (params) {
        if(validDB == false){
            console.log("Invalid DB");
            return undefined;
        }
        console.log("Valid DB");
        //return true;
        return this.searchFact(params, this.parsed_DB);
    }
}

module.exports = Interpreter;

