import eventDispatcher from '../src/eventDispatcher'
import { sizeOf } from '../src/utils.js'

describe('eventDispatcher', () => {
    beforeEach(() => {
        eventDispatcher.reset()
    })

    it('should add a listener and trigger the event', () => {
        const callback = jest.fn()
        eventDispatcher.addListener('testEvent', callback)

        eventDispatcher.dispatch('testEvent', 'arg1', 'arg2')

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('testEvent', 'arg1', 'arg2')
    })

    it('should handle multiple listeners for the same event', () => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()

        eventDispatcher.addListener('testEvent', callback1)
        eventDispatcher.addListener('testEvent', callback2)

        eventDispatcher.dispatch('testEvent', 'arg1')

        expect(callback1).toHaveBeenCalledTimes(1)
        expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('should add a listener that triggers only once', () => {
        const callback = jest.fn()

        eventDispatcher.addListenerOnce('testEvent', callback)

        eventDispatcher.dispatch('testEvent', 'arg1')
        eventDispatcher.dispatch('testEvent', 'arg2')

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('testEvent', 'arg1')
    })

    it('should remove a specific listener', () => {
        const callback = jest.fn()

        eventDispatcher.addListener('testEvent', callback)
        eventDispatcher.removeListener('testEvent', callback)

        eventDispatcher.dispatch('testEvent', 'arg1')

        expect(callback).not.toHaveBeenCalled()
    })

    it('should remove all listeners for an event', () => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()

        eventDispatcher.addListener('testEvent', callback1)
        eventDispatcher.addListener('testEvent', callback2)

        eventDispatcher.removeListener('testEvent')

        eventDispatcher.dispatch('testEvent', 'arg1')

        expect(callback1).not.toHaveBeenCalled()
        expect(callback2).not.toHaveBeenCalled()
    })

    it('should check if a listener exists', () => {
        const callback = jest.fn()

        eventDispatcher.addListener('testEvent', callback)

        expect(eventDispatcher.hasListener('testEvent')).toBe(true)
        expect(eventDispatcher.hasListener('nonExistentEvent')).toBe(false)
    })

    it('should handle events with multiple names', () => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()

        eventDispatcher.addListener('event1, event2', callback1)
        eventDispatcher.addListener('event2, event3', callback2)

        eventDispatcher.dispatch('event2', 'arg')

        expect(callback1).toHaveBeenCalledTimes(1)
        expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('should handle an empty event name gracefully', () => {
        const callback = jest.fn()

        eventDispatcher.addListener('', callback)
        eventDispatcher.dispatch('')

        expect(callback).not.toHaveBeenCalled()
    })

    it('should handle undefined or null event names', () => {
        expect(() => eventDispatcher.addListener(undefined, jest.fn())).toThrow()
        expect(() => eventDispatcher.addListener(null, jest.fn())).toThrow()
    })

    it('should not fail if dispatching an event with no listeners', () => {
        expect(() => eventDispatcher.dispatch('nonExistentEvent')).not.toThrow()
    })

    it('should maintain listener context when specified', () => {
        const context = { value: 42 }
        const callback = jest.fn(function () {
            expect(this).toBe(context)
        })

        eventDispatcher.addListener('testEvent', callback, context)
        eventDispatcher.dispatch('testEvent')
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if callback is not a function', () => {
        expect(() => eventDispatcher.addListener('testEvent', 'not a function')).toThrow()
    })

    it('should throw an error if events name are not a string', () => {
        expect(() => eventDispatcher.dispatch(null)).toThrow()
    })

    it('should do nothing if an empty event name is provided', () => {
        const mockCallback = jest.fn()
        eventDispatcher.addListenerOnce('', mockCallback)

        eventDispatcher.dispatch('someEvent')
        expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should return false if callback and context do not match any listener', () => {
        const callback = jest.fn()
        const context = { some: 'context' }
        eventDispatcher.addListener('testEvent', callback, { other: 'context' })

        const result = eventDispatcher.hasListener('testEvent', callback, context)

        expect(result).toBe(false)
    })

    it('should do nothing if listener does not exists', () => {
        const callback = jest.fn()
        const result = eventDispatcher.removeListener('nonExistentEvent', callback)

        expect(result).toBe(eventDispatcher)
        expect(eventDispatcher.hasListener('nonExistentEvent')).toBe(false)
    })

    it('should not remove a listener if callback or context does not match', () => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()
        const context1 = { some: 'context1' }
        const context2 = { some: 'context2' }

        eventDispatcher.addListener('testEvent', callback1, context1)
        eventDispatcher.addListener('testEvent', callback2, context2)

        eventDispatcher.removeListener('testEvent', callback1, context2)

        const allListeners = eventDispatcher.getListeners()
        const listeners = eventDispatcher.getListeners('testEvent')

        expect(sizeOf(allListeners)).toBe(1)
        expect(eventDispatcher.getListeners('notExists')).toHaveLength(0)
        expect(listeners).toHaveLength(2)
        expect(listeners[0].callback).toBe(callback1)
        expect(listeners[0].context).toBe(context1)
        expect(listeners[1].callback).toBe(callback2)
        expect(listeners[1].context).toBe(context2)
    })
})
