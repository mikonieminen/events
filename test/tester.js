(function() {
    var events = require(__dirname + "/../events.js");
    var Promise = require(__dirname + "/../../mini-promise/mini_promise.js").Promise;

    function ThingList() {
        this.things = [];
        this.async = false;
    }

    ThingList.prototype.__proto__ = events.EventEmitter.prototype;

    ThingList.prototype.add = function(thingName) {
        var i = this.things.indexOf(thingName);
        if (i > -1) {
            this.emit("error", "cannot add \"" + thingName + "\", allready added.");
        } else {
            this.things.push(thingName);
            this.emit("addThing", thingName);
        }
    };

    ThingList.prototype.remove = function(thingName) {
        var i = this.things.indexOf(thingName);
        if (i > -1) {
            this.things.splice(i, 1);
            this.emit("removeThing", thingName);
        } else {
            this.emit("error", "cannot remove \"" + thingName + "\", no such thing.");
        }
    };

    var thingList = new ThingList();

    thingList.addListener("newListener", function(event, listener) {
        console.log("New event listener for \"" + event + "\"");
    }).addListener("removeListener", function(event, listener) {
        console.log("Remove event listener from \"" + event + "\"");
    });

    var p1 = new Promise(function(ready, error, abort) {
        var additionListener = function(thingName) {
            thingList.removeListener("addThing", additionListener);
            thingList.removeListener("removeThing", removalListener);
            if (thingName === "train") {
                console.log("Adding \"train\" succeed.");
                ready();
            } else {
                error(new Error("Thing name does not match what is expected. Expecting \"train\", got \""
                                + thingName + "\""));
            }
        }
        var removalListener = function(thingName) {
            thingList.removeListener("addThing", additionListener);
            thingList.removeListener("removeThing", removalListener);
            error(new Error("Expecting \"addThing\" event, not \"removeThing\""));
        }
        thingList.on("removeThing", removalListener).on("addThing", additionListener);
        console.log("add train");
        thingList.add("train");
    }).on("ready", function() {
        var p2 = new Promise(function (ready, error, abort) {
            var additionListener = function(thingName) {
                thingList.removeListener("addThing", additionListener);
                thingList.removeListener("removeThing", removalListener);
                if (thingName === "drums") {
                    console.log("Adding \"drums\" succeed.");
                    ready();
                } else {
                    error(new Error("Thing name does not match what is expected. Expecting \"drum\", got \""
                                    + thingName + "\""));
                }
            }
            var removalListener = function(thingName) {
                thingList.removeListener("addThing", additionListener);
                thingList.removeListener("removeThing", removalListener);
                error(new Error("Expecting \"addThing\" event, not \"removeThing\""));
            }
            thingList.on("removeThing", removalListener).on("addThing", additionListener);
            console.log("add drums");
            thingList.add("drums");
        }).on("ready", function() {
            var p3 = new Promise(function(ready, error, abort) {
                var additionListener = function(thingName) {
                    thingList.removeListener("addThing", additionListener);
                    thingList.removeListener("removeThing", removalListener);
                    if (thingName === "apple") {
                        console.log("Adding \"apple\" succeed.");
                        ready();
                    } else {
                        error(new Error("Thing name does not match what is expected. Expecting \"apple\", got \""
                                        + thingName + "\""));
                    }
                }
                var removalListener = function(thingName) {
                    thingList.removeListener("addThing", additionListener);
                    thingList.removeListener("removeThing", removalListener);
                    error(new Error("Expecting \"addThing\" event, not \"removeThing\""));
                }
                thingList.on("removeThing", removalListener).on("addThing", additionListener);
                console.log("add apple");
                thingList.add("apple");
            }).on("ready", function() {
                var p4 = new Promise(function(ready, error, abort) {
                    var additionListener = function(thingName) {
                        thingList.removeListener("addThing", additionListener);
                        thingList.removeListener("removeThing", removalListener);
                        error(new Error("Expecting \"removeThing\" event, not \"addThing\""));
                    }
                    var removalListener = function(thingName) {
                        thingList.removeListener("addThing", additionListener);
                        thingList.removeListener("removeThing", removalListener);
                        if (thingName === "drums") {
                            console.log("Removing \"drums\" succeed.");
                            ready();
                        } else {
                            error(new Error("Thing name does not match what is expected. Expecting \"drums\", got \""
                                            + thingName + "\""));
                        }
                    }
                    thingList.on("removeThing", removalListener).on("addThing", additionListener);
                    console.log("remove drums");
                    thingList.remove("drums");
                }).on("error", function(err) {
                    console.error("Got error: ", err);
                });
            }).on("error", function(err) {
                console.error("Got error: ", err);
            });
        }).on("error", function(err) {
            console.error("Got error: ", err);
        });
    }).on("error", function(err) {
        console.error("Got error: ", err);
    });
})();
