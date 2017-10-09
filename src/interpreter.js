String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var Interpreter = function () {

    var factDB;
    var ruleDB;
    var validDB;

    //Validacion de entrada
    this.hasPattern = function(string){
        //Checks if "string" is either a Fact or a Rule.
        return(this.isValidFact(string) || this.isValidRule(string));
    };


    this.isValidRule = function (string){
        //Checks if "string" is a rule.
        var ruleRegex = /\w+\(\w+(,\ \w+)*\)\ \:\-\ (\w+\(\w+(,\ \w+)*\),\ )*/;
        return ruleRegex.test(string);
    };

    this.isValidFact = function (string){
        //"Checks if "string" is a fact.
        if(this.isValidRule(string)){
            return false;
        }
        var factReg = /\w+\(\w+(, \w+)*\)/;
        return factReg.test(string);
    };

    this.isValidDB = function(array){
        //Checks if the database only contains facts/rules.
        for(var i=0;i<array.length;i++){
            if(!this.hasPattern(array[i])){
                return false;
            }
        }
        return true;
    };

    //Limpieza de DB
    this.removeDotsAndSpace = function(string){
        //Removes all dots and spaces from "string".
        var cleanString = string.replace('.','');
        return cleanString.replace(/ /g,'');
    };


    //Creacion DB Facts
    this.createFactDB = function (array){
        //Creates and returns a new array which contains only the valid facts from "array".
        var aux = [];
        for (var i=0;i<array.length;i++){
            if(this.isValidFact(array[i])){
                aux.push(this.removeDotsAndSpace(array[i]));
            }
        }
        return aux;
    };
    //Busqueda de Fact
    this.searchFact = function(fact, db) {
        //Searches for "fact" in "db". Returns true if found.
        for (var i = 0; i < db.length; i++) {
            if (fact === db[i]) {
                return true;
            }
        }
        return false;
    };

    //Creacion DB Rules
    this.createRuleDB = function (array) {
        //Creates new array with only the valid rules from "array".
        var aux = [];
        for (var i=0;i<array.length;i++){
            if(this.isValidRule(array[i])){
                aux.push(this.removeDotsAndSpace(array[i]));
            }
        }
        return aux;
    };
    //Transformacion de Rule
    this.getRule = function (Qrule, db) {
        //Returns the rule in "db" corresponding to the query "Qrule".
        var ruleName = Qrule.split("(")[0];
        for (var i=0;i<db.length;i++){
            var dbRuleName = db[i].split("(")[0];
            if(ruleName===dbRuleName){
                return db[i];
            }
        }
        return false;
    };

    this.getParameters = function(string){
        //Returns an array with the parameters of the rule "string". Ex: hijo(X,Y) => [X,Y]
        var regex1 = /\([^)]+\)/;
        var regex2 = /[()]/g;
        var parameterString = string.match(regex1)[0];
        return parameterString.replace(regex2,"").split(",");
    };

    this.changeParameters = function(QRule, DBRule){
        //Replaces the parameters in rule "DBRule" with the ones in "QRule". Returns false if they have a different
        //amount of parameters.
        var QRuleParameters = this.getParameters(QRule);
        var DBRuleParameters = this.getParameters(DBRule);
        var replacedRule = DBRule;

        if(QRuleParameters.length !== DBRuleParameters.length){
            return false;
        }
        for(var i=0; i<QRuleParameters.length;i++){
            var aux1 = DBRuleParameters[i];
            var aux2 = QRuleParameters[i];
            replacedRule = replacedRule.replaceAll(aux1, aux2);
        }
        return replacedRule;
    };

    //Busqueda de Rule
    this.searchRule = function (QRule,DB){
        //Evaluates the rule query (QRule).
        var RuleToUse = this.getRule(QRule,DB);
        if(RuleToUse===false){
            return false;
        }
        var replacedRule = this.changeParameters(QRule,RuleToUse);
        if(replacedRule === false){
            return false;
        }
        var factRegex = /\w+\(\w+(,\w+)*\)/g;
        return this.searchMultipleFacts(replacedRule.split(":-")[1].match(factRegex));
    };

    this.searchMultipleFacts = function(array){
        //Searches every fact of array in the factDB.
        for(var i=0;i<array.length;i++){
            if(!this.searchFact(array[i],factDB)){
                return false;
            }
        }
        return true;
    };


    //Logica de interprete
    this.parseDB = function (params, paramss, paramsss) {
        validDB = this.isValidDB(params);
        if (validDB === false){
            return;
        }
        factDB = this.createFactDB(params);
        ruleDB = this.createRuleDB(params);
    };

    this.checkQuery = function (params) {
        if(validDB === false){
            console.log("Invalid DB");
            return undefined;
        }
        if(!this.hasPattern(params)){
            console.log("Invalid Query");
            return false;
        }
        var boolFactFound = this.searchFact(this.removeDotsAndSpace(params), factDB);
        var boolRuleFound = this.searchRule(this.removeDotsAndSpace(params),ruleDB);
        return (boolFactFound || boolRuleFound);
    };
};

module.exports = Interpreter;

