/**
 * @author Miko Nieminen <miko.nieminen@iki.fi>
 * @license {@link http://opensource.org/licenses/MIT|MIT}
 *
 * @name events
 * @module
 * @requires mini-module
 * @see {@link http://nodejs.org/api/events.html}
 */
(function(exports) {
    "use strict";

    /**
     * Event indicating that listener is unregistered from an event.
     *
     * @event module:events.EventEmitter:removeListener
     *
     * @property {String} event Event name.
     * @property {Function} listener Listener callback.
     */

    /**
     * Event indicating that new listener is registered for an event.
     *
     * @event module:events.eventEmitter:newListener
     *
     * @property {String} event Event name.
     * @property {Function} listener Listener callback.
     */

    /**
     * EventEmitter for browser runtimes matching node.js events.EventEmitter.
     *
     * @name module:events.EventEmitter
     * @see {@link http://nodejs.org/api/events.html#events_class_events_eventemitter}
     *
     * @constructor
     * @property {Object} listeners Mapping events to event listers.
     ' @property {Boolean} async Emit events asynchronously or synchronously. True=asynchronous, false=synchronous.
     */
    function EventEmitter() {
        this.listeners = {};
        this.async = true;
    }

    /**
     * Register callback for certain events.
     *
     * @public
     * @method
     *
     * @name module:events.EventEmitter#addListener
     * @see {@link module:events.EventEmitter#on
     * @see {@link http://nodejs.org/api/events.html#events_emitter_addlistener_event_listener}
     *
     * @param {String} event Name of the event to subscribe for.
     * @param {Function} listener Listener callback that will be called when event is emit.
     * @returns {module:eventsEventEmitter} Returns this to allow chaining.
     * @emits module:events.EventEmitter:newListener
     */
    EventEmitter.prototype.addListener = function(event, listener) {
        this.on(event, listener);
        return this;
    };

    /**
     * Register callback for certain events.
     *
     * @public
     * @method
     *
     * @name module:events.EventEmitter#on
     * @see {@link http://nodejs.org/api/events.html#events_emitter_on_event_listener}
     *
     * @param {String} event Name of the event to subscribe for.
     * @param {FUnction} listener Listener callback that will be called when event is emit.
     * @returns {module:eventsEventEmitter} Returns this to allow chaining.
     * @emits module:events.EventEmitter:newListener
     */
    EventEmitter.prototype.on = function(event, listener) {
        if (typeof this.listeners[event] === "undefined") {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);

        // Notify about the new listener.
        this.emit("newListener", event, listener);
        return this;
    };

    /**
     * Register callback that will called only after first time event is emit and removed then.
     *
     * @public
     * @method
     *
     * @name module:events.EventEmitter#once
     * @see {@link http://nodejs.org/api/events.html#events_emitter_once_event_listener}
     *
     * @param {String} event Name of the event to subscribe for.
     * @param {Function} listener Listener callback that will be called when event is emit.
     * @returns {module:eventsEventEmitter} Returns this to allow chaining.
     * @emits module:events.EventEmitter:newListener
     */
    EventEmitter.prototype.once = function(event, listener) {
        throw new Error("Not implemented.");
    };

    /**
     * Unregister listener callback from an event.
     *
     * @public
     * @method
     *
     * @name module:events.EventEmitter#removeListener
     * @see {@link http://nodejs.org/api/events.html#events_emitter_removelistener_event_listener}
     *
     * @param {String} event Name of the event to unsubscribe from.
     * @param {Function} listener Listener callback matching the one should be removed.
     * @returns {module:eventsEventEmitter} Returns this to allow chaining.
     * @emits module:events.EventEmitter:removeListener
     */
    EventEmitter.prototype.removeListener = function(event, listener) {
        var i = null;
        var listeners = null;
        if (this.listeners[event] instanceof Array) {
            listeners = this.listeners[event];
            while (i < listeners.length) {
                if (listeners[i] === listener) {
                    // remove listener
                    listeners.splice(i, 1);

                    // Notify about removal of the listener
                    this.emit("removeListener", event, listener);
                } else {
                    ++i;
                }
            }

            // last listener was remove, delete the property
            // mapping listeners array to the event.
            if (listeners.length === 0) {
                delete this.listeners[event];
            }
        }
        return this;
    };

    /**
     * Unregister all listener callbacks from an event.
     *
     * @public
     * @method
     *
     * @name module:events.EventEmitter#removeAllListeners
     * @see {@link http://nodejs.org/api/events.html#events_emitter_removealllisteners_event}
     *
     * @param {String} event Name of the event to unregister all listener callbacks.
     * @returns {module:eventsEventEmitter} Returns this to allow chaining.
     * @emits module:events.EventEmitter:removeListener
     */
    EventEmitter.prototype.removeAllListeners = function(event) {
        var i;
        var listeners;
        if (this.listeners[event] instanceof Array) {
            listeners = this.listeners[event];
            // Remove all listeners
            delete this.listeners[event];

            // Notify removal of all listeners
            for (i = 0; i < listeners.length; ++i) {
                this.emit("removeListener", event, listeners[i]);
            }
        }
        return this;
    };

    /**
     * Set maximum number of listeners for any one event before printing a warning.
     *
     * @public
     * @method
     *
     * @name module:events.EventEmitter#setMaxListeners
     * @see {@link http://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n}
     *
     * @param {Integer} n Maximum number of listeners.
     */
    EventEmitter.prototype.setMaxListeners = function(n) {
        throw new Error("Not implemented.");
    };

    /**
     * Return all listeners registered for an event.
     *
     * @public
     * @method
     *
     * @name module:events.EventEmitter#listeners
     * @see {@link http://nodejs.org/api/events.html#events_emitter_listeners_event}
     *
     * @param {String} event Name of the event listers should be returned.
     * @returns {Array.<Function>} Array of listener functions.
     */
    EventEmitter.prototype.listeners = function(event) {
        return this.listeners[event];
    };

    /**
     * Emit an event.
     *
     * @public
     * @method
     *
     * @name module:events.EventEmitter#emit
     * @see {@link http://nodejs.org/api/events.html#events_emitter_emit_event_arg1_arg2}
     *
     * @param {String} event Name of the event to emit.
     * @returns {Boolean} True if any listeners were registered, false if none were registered for the event.
     */
    EventEmitter.prototype.emit = function(event) {
        var i = 0;
        var listeners = null;
        var eventArguments = Array.prototype.slice.call(arguments, 1);
        if (this.listeners[event] instanceof Array) {
            listeners = this.listeners[event];
            for (i = 0; i < listeners.length; ++i) {
                // Emit events asynchronously
                if (this.async) {
                    setTimeout(function(cb, args) {
                        cb.apply(undefined, args);
                    }, 0, listeners[i], eventArguments);
                } else {
                    listeners[i].apply(undefined, eventArguments);
                }
            }
            return true;
        } else {
            return false;
        }
    };

    exports.EventEmitter = EventEmitter;

})(typeof exports !== "undefined" ? exports : this.events = {} );
