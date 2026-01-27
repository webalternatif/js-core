import { isFunction, isString, isUndefined } from './is.js'
import { each, map } from './traversal.js'

class EventDispatcher {
    #listeners = {}

    addListener(eventsName, callback, context, ...args) {
        if (!isFunction(callback)) {
            throw new Error('Callback must be a function.')
        }

        if (!isString(eventsName)) {
            throw new Error('Events name must be a string separated by comma.')
        }

        const listener = { callback, context, args }
        each(eventsName.split(','), (i, eventName) => {
            if (!eventName) return true // continue

            eventName = eventName.trim()

            if (this.hasListener(eventName)) {
                this.#listeners[eventName].push(listener)
            } else {
                this.#listeners[eventName] = [listener]
            }
        })

        return this
    }

    addListenerOnce(eventsName, callback, context, ...listenerArgs) {
        each(eventsName.split(','), (i, eventName) => {
            eventName = eventName.trim()

            if (!eventName) return true // continue

            const handler = (...args) => {
                callback.apply(context, [eventName].concat(listenerArgs).concat(args.slice(1)))
                this.removeListener(eventName, handler)
            }

            this.addListener(eventName, handler, context)
        })

        return this
    }

    dispatch(eventsName, ...args) {
        if (!isString(eventsName)) {
            throw new Error('Events name must be a string seperated by comma.')
        }

        each(eventsName.split(','), (i, eventName) => {
            eventName = eventName.trim()

            if (!eventName) return true // continue

            if (!this.hasListener(eventName)) {
                console.warn(`No listeners found for event: ${eventName}`)
                return true // continue
            }

            each(this.#listeners[eventName], (i, listener) => {
                listener.callback.apply(
                    listener.context,
                    [eventName].concat(listener.args).concat(args),
                )
            })
        })

        return this
    }

    hasListener(eventName, callback, context) {
        if (isUndefined(callback)) {
            return !isUndefined(this.#listeners[eventName])
        }

        return !!map(this.#listeners[eventName], (i, listener) => {
            return listener.callback === callback && listener.context === context ? true : null
        }).length
    }

    removeListener(eventName, callback, context) {
        if (this.hasListener(eventName, callback, context)) {
            if (isUndefined(callback)) {
                this.#listeners[eventName].splice(0)
            } else {
                each(this.#listeners[eventName], (i) => {
                    this.#listeners[eventName].splice(i, 1)
                    delete this.#listeners[eventName]
                    return false // break
                })
            }
        }

        return this
    }

    getListeners(eventName) {
        return eventName ? this.#listeners[eventName] || [] : this.#listeners
    }

    reset() {
        this.#listeners = {}
    }
}

const eventDispatcher = new EventDispatcher()

export default eventDispatcher
