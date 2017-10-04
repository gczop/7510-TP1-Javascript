var Interpreter = function () {

    var parsed_DB;
    var validDB;

    //Validacion de entrada
    this.hasPattern = function(string){
        return(this.isValidFact(string) || this.isValidRule(string));
    }


    this.isValidRule = function (string){
        var ruleRegex = /\w+\(\w+(,\ \w+)*\)\ \:\-\ (\w+\(\w+(,\ \w+)*\),\ )*./;
        return ruleRegex.test(string);
    }

    this.isValidFact = function (string){
        if(this.isValidRule(string)){
            return false;
        }
        var factReg = /\w+\(\w+(, \w+)*\)./;
        return factReg.test(string);
    }

    this.isValidDB = function(array){
        for(var i=0;i<array.length;i++){
            if(!this.hasPattern(array[i])){
                return false;
            }
        }
        return true;
    }

    //Limpieza de DB
    this.removeDotsAndSpace = function(string){
        var cleanString = string.replace('.','');
        return cleanString.replace(' ','');
    }

    this.cleanDB = function(array){
        var cleanArray = [];
        for(var i=0;i<array.length;i++){
            var cleanString = this.removeDotsAndSpace(array[i]);
            cleanArray.push(cleanString);
        }
        return cleanArray;
    }

    //Busqueda de Fact
    this.searchFact = function(fact, db) {
        for (var i = 0; i < db.length; i++) {
            if (fact === db[i]) {
                return true;
            }
        }
        return false;
    }

    //Busqueda de Rule

    this.parseDB = function (params, paramss, paramsss) {
        validDB = this.isValidDB(params);
        if (validDB == false){
            return;
        }
        parsed_DB = this.cleanDB(params);
    }

    this.checkQuery = function (params) {
        if(validDB == false){
            console.log("Invalid DB");
            return undefined;
        }
        console.log("Valid DB");
        //return true;
        return this.searchFact(this.removeDotsAndSpace(params), parsed_DB);
    }
}

module.exports = Interpreter;

