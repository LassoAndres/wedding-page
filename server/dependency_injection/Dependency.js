"use strict";

// Initialize singleton global dependencies
(function (){
    if (!global.dependencies) {
        global.dependencies = new Map();
    }
})()

class Dependency {

    bind(className, clsSupplier) {
        return function() {
            if (!global.dependencies.has(className)) {
                global.dependencies.set(className, clsSupplier.call());
            }
            return global.dependencies.get(className)
        }
    }

}

module.exports = Dependency