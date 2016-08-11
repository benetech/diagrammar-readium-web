/* Custom settings: Part of the diagrammer project.
Copyright Benetech 2016.
*/


var customElementSettings = {};
(function(){
    //Closure
    "use strict";
    function _normalize(item){
        /* Normalizes a setting key so that it retreavs the proper setting.  This is called from get and set.*/
        //Some browsers don't like - in the key.
        item = item.replace("-", "");
        //To keep it simple, uppercase.
        item = item.toLocaleUpperCase();
        return item;
    }
    
    function put(item, value){
        item = _normalize(item);
        settings.put(item, value);
    }
    
    function get(item, callback){
        item = _normalize(item);
        settings.get(item, callback);
    }
    
    function setOrGetCustomElementFromStore(tag, callback){
        /* 
            * setOrGetCustomElementFromStore: 
            * Tries to get the element from the settings storage, and if that fails, sets it to true.
            * Then, it calls the callback with the settings value.
            * @param tag: The tag name, which is used as the key. The tag name usually maps to a dg-* element.
            * @type tag: String.
            * @param callback: A callback to call when the method has retreaved or set a setting mapped to tag.
            * @type callback: function with the following parameter.
            * @callbackParam settingVal: The value of the setting.
            * @callbackParamType settingVal: boolean
            @returns: void
        */
        if(typeof(callback) !== "function") throw(TypeError("Callback must be a function"));
        get(tag, function(result){
            if(result === null){ 
                put(tag, true);
                result=true;
            }
            callback(result);
        });
    }
    
    customElementSettings.initializeSettings = function(){
        //Has the author disabled settings?
        if(this.hasAttribute("disable-settings")){
            return;
        }
        var element = this;
        //Get tag name, it'll be our key.
        var tag = element.tagName;
        //Our settings store stores the tag name with a boolean of whether we should save it. In future, we might update this if for example each component can have multiple states.
        setOrGetCustomElementFromStore(tag, function(setting){
            if(setting){
                //show the element.
                element.setAttribute("aria-hidden", "false");
                element.style.display = "";
            }
            else{
                element.setAttribute("aria-hidden", "true");
                element.style.display = "none";
            }
        });
    }    
    
    customElementSettings.onChange = function(evt){
        /* 
            onChange
            handler for toggling this setting.
            @var evt: the event.
            */
            put(this.id, this.checked);
    }
    
    customElementSettings.registerElement = function(element){
        setOrGetCustomElementFromStore(element.id, (value) =>{
            if(value){
                element.setAttribute("checked", "checked");
            }
            else{
                element.removeAttribute("checked");
            }
        });
    }
})();