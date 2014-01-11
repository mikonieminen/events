;(function() {
    "use strict";

    describe("Events tests", function() {
        var events = require("../events.js");

        function ThingList() {
            events.EventEmitter.call(this);
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

        it("Single event listener, single addition", function(done) {
            var thingList = new ThingList();

            var additionListener = function(thingName) {
                console.log("here with thing: " + thingName);
                if (thingName === "train") {
                    done();
                } else {
                    done(new Error("Thing name does not match what is expected. Expecting \"train\", got \""
                                    + thingName + "\""));
                }
            };

            thingList.on("addThing", additionListener);
            thingList.add("train");
        });

        it("Two event listeners, single addition", function(done) {
            var expectedCount = 1;
            var listenersCalled = {};
            var thingList = new ThingList();

            function listenerCalled(name) {
                var allCalled = true;
                if (listenersCalled[name]) {
                    listenersCalled[name] += 1;
                } else {
                    listenersCalled[name] = 1;
                }
                if (Object.keys(listenersCalled).length === 2) {
                    for (name in listenersCalled) {
                        if (listenersCalled[name] !== expectedCount) {
                            allCalled = false;
                            break;
                        }
                    }
                    if (allCalled) {
                        done();
                    }
                }
            }

            function additionListener1(thingName) {
                if (thingName === "train") {
                    listenerCalled("additionListener1");
                } else {
                    done(new Error("Thing name does not match what is expected. Expecting \"train\", got \""
                                    + thingName + "\""));
                }
            }

            function additionListener2(thingName) {
                if (thingName === "train") {
                    listenerCalled("additionListener2");
                } else {
                    done(new Error("Thing name does not match what is expected. Expecting \"train\", got \""
                                    + thingName + "\""));
                }
            }

            thingList.on("addThing", additionListener1);
            thingList.on("addThing", additionListener2);
            thingList.add("train");
        });

        it("Two event listeners, two additions", function(done) {
            var expectedCount = 1;
            var listenersCalled = {};
            var thingList = new ThingList();

            function listenerCalled(name) {
                var allCalled = true;
                if (listenersCalled[name]) {
                    listenersCalled[name] += 1;
                } else {
                    listenersCalled[name] = 1;
                }
                if (Object.keys(listenersCalled).length === 2) {
                    for (name in listenersCalled) {
                        if (listenersCalled[name] !== expectedCount) {
                            allCalled = false;
                            break;
                        }
                    }
                    if (allCalled) {
                        done();
                    }
                }
            }

            function additionListener1(thingName) {
                if (thingName === "train" || thingName === "drums") {
                    listenerCalled("additionListener1");
                } else {
                    done(new Error("Thing name does not match what is expected. Expecting \"train\", got \""
                                    + thingName + "\""));
                }
            }

            function additionListener2(thingName) {
                if (thingName === "train" || thingName === "drums") {
                    listenerCalled("additionListener2");
                } else {
                    done(new Error("Thing name does not match what is expected. Expecting \"train\", got \""
                                    + thingName + "\""));
                }
            }

            thingList.on("addThing", additionListener1);
            thingList.on("addThing", additionListener2);
            thingList.add("train");
            thingList.add("drums");
        });

        it("Two event listeners, add one, remove one listener and add second", function(done) {
            var allDone = false;
            var listeners = {
                "additionListener1": {
                    expectedCount: 2,
                    count: 0
                },
                "additionListener2": {
                    expectedCount: 1,
                    count: 0
                }
            };
            var thingList = new ThingList();

            function listenerCalled(name) {
                var allCalled = true;
                listeners[name].count++;
                for (name in listeners) {
                    if (listeners[name].count !== listeners[name].expectedCount) {
                        allCalled = false;
                        break;
                    }
                }
                if (allCalled) {
                    allDone = true;
                    done();
                }
            }

            function additionListener1(thingName) {
                console.assert(!allDone, "Got event when everything should be done already.");
                if (thingName === "train" || thingName === "drums") {
                    listenerCalled("additionListener1");
                } else {
                    done(new Error("Thing name does not match what is expected. Expecting \"train\", got \""
                                    + thingName + "\""));
                }
            }

            function additionListener2(thingName) {
                console.assert(!allDone, "Got event when everything should be done already.");
                if (thingName === "train" || thingName === "drums") {
                    listenerCalled("additionListener2");
                } else {
                    done(new Error("Thing name does not match what is expected. Expecting \"train\", got \""
                                    + thingName + "\""));
                }
            }

            thingList.on("addThing", additionListener1);
            thingList.on("addThing", additionListener2);
            thingList.add("train");
            thingList.removeListener("addThing", additionListener2);
            thingList.add("drums");
        });
    });
})();
