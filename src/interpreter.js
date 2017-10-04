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
        return(this.isValidFact(string) || this.isValidRule(string));
    };


    this.isValidRule = function (string){
        var ruleRegex = /\w+\(\w+(,\ \w+)*\)\ \:\-\ (\w+\(\w+(,\ \w+)*\),\ )*./;
        return ruleRegex.test(string);
    };

    this.isValidFact = function (string){
        if(this.isValidRule(string)){
            return false;
        }
        var factReg = /\w+\(\w+(, \w+)*\)./;
        return factReg.test(string);
    };

    this.isValidDB = function(array){
        for(var i=0;i<array.length;i++){
            if(!this.hasPattern(array[i])){
                return false;
            }
        }
        return true;
    };

    //Limpieza de DB
    this.removeDotsAndSpace = function(string){
        var cleanString = string.replace('.','');
        return cleanString.replace(/ /g,'');
    };


    //Creacion DB Facts
    this.createFactDB = function (array){
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
        for (var i = 0; i < db.length; i++) {
            if (fact === db[i]) {
                return true;
            }
        }
        return false;
    };

    //Creacion DB Rules
    this.createRuleDB = function (array) {
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
        var regex1 = /\([^)]+\)/;
        var regex2 = /[()]/g;
        var parameterString = string.match(regex1)[0];
        return parameterString.replace(regex2,"").split(",");
    };

    this.changeParameters = function(QRule, DBRule){

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
        var boolFactFound = this.searchFact(this.removeDotsAndSpace(params), factDB)
        var boolRuleFound = this.searchRule(this.removeDotsAndSpace(params),ruleDB);
        return (boolFactFound || boolRuleFound);
    };
};

module.exports = Interpreter;

