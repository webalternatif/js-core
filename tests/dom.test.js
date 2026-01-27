import dom, { isWindow, isDocument, isDomElement, getStyle } from '../src/dom.js'
import Mouse from '../src/Mouse.js'
import { __resetCustomEventsForTests } from '../src/onOff.js'
import * as is from '../src/is.js'

function dispatchTouch(el, type) {
    el.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }))
}

describe('dom methods', () => {
    describe('isWindow()', () => {
        it('should returns true for window object', () => {
            expect(isWindow(window)).toBe(true)
        })

        it('should return false for a DOM element', () => {
            const div = document.createElement('div')
            expect(isWindow(div)).toBe(false)
        })

        it('should return false for primitives', () => {
            expect(isWindow(123)).toBe(false)
            expect(isWindow(null)).toBe(false)
            expect(isWindow('string')).toBe(false)
        })
    })

    describe('isDocument()', () => {
        it('should returns true for document object', () => {
            expect(isDocument(document)).toBe(true)
        })

        it('should return false for a DOM element', () => {
            const div = document.createElement('div')
            expect(isDocument(div)).toBe(false)
        })

        it('should return false for primitives', () => {
            expect(isDocument(123)).toBe(false)
            expect(isDocument(null)).toBe(false)
            expect(isDocument('string')).toBe(false)
        })
    })

    describe('isDomElement()', () => {
        it('should return true for a DOM element', () => {
            const div = document.createElement('div')
            expect(isDomElement(div)).toBe(true)
        })

        it('should return false for non-DOM objects', () => {
            expect(isDomElement({})).toBe(false)
            expect(isDomElement(null)).toBe(false)
            expect(isDomElement(undefined)).toBe(false)
            expect(isDomElement(42)).toBe(false)
            expect(isDomElement('string')).toBe(false)
            expect(isDomElement({ nodeType: 1 })).toBe(false)
        })
    })

    describe('getStyle', () => {
        const mockElement = (styles = {}) => {
            const element = document.createElement('div')
            Object.assign(element.style, styles)
            return element
        }

        const mockNonDomElement = () => ({})

        it('should return empty string for non-DOM elements', () => {
            const nonDomElement = mockNonDomElement()
            expect(getStyle(nonDomElement, 'color')).toBe('')
        })

        it('should return the computed style for a valid DOM element', () => {
            const elem = mockElement({ color: 'red' })
            document.body.appendChild(elem)

            expect(getStyle(elem, 'color')).toBe('red')
            document.body.removeChild(elem)
        })

        it('should return inline style when no computed style is available', () => {
            const elem = mockElement({ backgroundColor: 'blue' })
            expect(getStyle(elem, 'background-color')).toBe('blue')
        })

        it('should return camelCase style for kebab-case properties', () => {
            const elem = mockElement({ backgroundColor: 'green' })
            expect(getStyle(elem, 'background-color')).toBe('green')
        })

        it('should return empty string for undefined styles', () => {
            const elem = mockElement()
            expect(getStyle(elem, 'color')).toBe('')
        })

        it('should return empty string for invalid cssRule', () => {
            const elem = mockElement({ color: 'red' })
            expect(getStyle(elem, 'invalid-rule')).toBe('')
        })

        it('should handle cases where getComputedStyle is unavailable', () => {
            const originalGetComputedStyle = window.getComputedStyle
            delete window.getComputedStyle

            const elem = mockElement({ color: 'blue' })
            expect(getStyle(elem, 'color')).toBe('blue')
            expect(getStyle(elem, 'notexists')).toBe('')

            window.getComputedStyle = originalGetComputedStyle
        })
    })
})

describe('dom manipulation', () => {
    /** @type {HTMLDivElement} */
    let el

    beforeEach(() => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
        __resetCustomEventsForTests()

        el = document.createElement('div')
        el.id = 'root'

        for (let i = 0; i < 3; i++) {
            const child = document.createElement('div')
            child.classList.add('child')
            child.classList.add(`child${i}`)
            el.append(child)

            for (let j = 0; j < 3; j++) {
                const grandchild = document.createElement('div')
                grandchild.classList.add('grandchild')
                grandchild.classList.add(`grandchild${j}`)
                child.append(grandchild)
            }
        }

        document.body.append(el)
    })

    afterEach(() => {
        __resetCustomEventsForTests()
        jest.useRealTimers()

        document.body.innerHTML = ''
    })

    describe('children()', () => {
        it('should return children of element', () => {
            expect(dom.children(el).length).toBe(3)
            expect(dom.children(el, '.child1').length).toBe(1)
            expect(dom.children(el, '.notexists').length).toBe(0)
        })
    })

    describe('child()', () => {
        it('should return one child of element', () => {
            const firstChild = el.children[0]
            const secondChild = el.children[1]

            expect(dom.child(el)).toBe(firstChild)
            expect(dom.child(el, '.child1')).toBe(secondChild)
            expect(dom.child(el, '.notexists')).toBe(null)
        })
    })

    describe('find()', () => {
        it('should return descendants of element', () => {
            expect(dom.find(el, '.grandchild')).toHaveLength(9)
            expect(dom.find('.grandchild')).toHaveLength(9) // refEl implicite = document
        })

        it('should return direct element if selector is an Element inside refEl', () => {
            const child = el.querySelector('.child1')
            const result = dom.find(el, child)

            expect(result).toEqual([child])
        })

        it('should return empty if selector Element is outside refEl', () => {
            const outside = document.createElement('div')
            document.body.append(outside)

            const result = dom.find(el, outside)
            expect(result).toEqual([])
        })

        it('should accept NodeList as selector and filter by refEl containment', () => {
            const nodeList = document.querySelectorAll('.grandchild')
            const result = dom.find(el, nodeList)

            expect(result).toHaveLength(9)
            result.forEach((e) => expect(el.contains(e)).toBe(true))
        })

        it('should accept Array of elements as selector', () => {
            const arr = Array.from(document.querySelectorAll('.child'))
            const result = dom.find(el, arr)

            expect(result).toHaveLength(3)
        })

        it('should ignore non-elements in array-like selector', () => {
            const arr = [document.createElement('div'), 'foo', null]
            const result = dom.find(el, arr)

            expect(result).toEqual([])
        })

        it('should return empty list on invalid selector', () => {
            expect(dom.find(el, '!!!')).toEqual([])
        })

        it('should return empty list if refEl does not contain matches', () => {
            const other = document.createElement('div')
            document.body.append(other)

            const result = dom.find(other, '.grandchild')
            expect(result).toEqual([])
        })
    })

    describe('findOne()', () => {
        it('should return first descendant of element matching selector', () => {
            const child = el.children[0]
            const grandChild = child.children[0]

            expect(dom.findOne(el, '.grandchild')).toBe(grandChild)
            expect(dom.findOne('.grandchild')).toBe(grandChild)
        })

        it('should return null on invalid selector', () => {
            expect(dom.findOne(el, '!!!')).toBe(null)
        })
    })

    describe('findOneByData() / findByData()', () => {
        it('should return the matching descendants by data attribute', () => {
            const a = el.querySelector('.child1 .grandchild0')
            const b = el.querySelector('.child1 .grandchild1')

            a.dataset.test = 'x'
            b.dataset.test = 'x'

            const found = dom.findByData(el, 'test', 'x')

            expect(found).toHaveLength(2)
            expect(found).toEqual([a, b])
        })

        it('should return the first matching descendant by data attribute', () => {
            const a = el.querySelector('.child1 .grandchild0')
            const b = el.querySelector('.child1 .grandchild1')

            a.dataset.test = 'x'
            b.dataset.test = 'x'

            const found = dom.findOneByData(el, 'test', 'x')

            expect(found).toBe(a)
        })

        it('should return null if nothing matches', () => {
            expect(dom.findOneByData(el, 'test', 'missing')).toBeNull()
        })
    })

    describe('addClass()', () => {
        it('should add classes to element', () => {
            dom.addClass(el, 'perceval karadoc')

            expect(el.classList.contains('perceval')).toBe(true)
            expect(el.classList.contains('karadoc')).toBe(true)
        })

        it('should add classes to all matching descendants (NodeList)', () => {
            const grandchildren = el.querySelectorAll('.grandchild')

            dom.addClass(grandchildren, 'graal')

            grandchildren.forEach((gc) => {
                expect(gc.classList.contains('graal')).toBe(true)
            })
        })

        it('should handle empty string', () => {
            const before = [...el.classList]
            dom.addClass(el, '')
            expect([...el.classList]).toEqual(before)
        })

        it('should ignore non-elements in collection', () => {
            const child = el.querySelector('.child0')

            dom.addClass([child, null, 'Karadoc', 42], 'Kaamelott')

            expect(child.classList.contains('Kaamelott')).toBe(true)
        })

        it('should trim and ignore empty class names', () => {
            dom.addClass(el, '   arthur   merlin   ')

            expect(el.classList.contains('arthur')).toBe(true)
            expect(el.classList.contains('merlin')).toBe(true)
        })

        it('should not duplicate classes if already present', () => {
            const child = el.querySelector('.child2')

            dom.addClass(child, 'lancelot')
            dom.addClass(child, 'lancelot')

            const occurrences = [...child.classList].filter((c) => 'lancelot' === c).length
            expect(occurrences).toBe(1)
        })

        it('should ignore non-elements in collection', () => {
            const child = el.querySelector('.child0')

            dom.removeClass([child, null, 'Karadoc', 42], 'child0')

            expect(child.classList.contains('child0')).toBe(false)
        })

        it('should return the original input (chainable)', () => {
            const result = dom.addClass(el, 'gauvain')
            expect(result).toBe(el)
        })
    })

    describe('removeClass()', () => {
        it('should remove classes to element', () => {
            const child = el.children[0]
            dom.removeClass(child, 'child child1')

            expect(el.classList.contains('child')).toBe(false)
            expect(el.classList.contains('child1')).toBe(false)
        })

        it('should handle empty string', () => {
            el.classList.add('root')

            const before = [...el.classList]
            dom.removeClass(el, '')
            expect([...el.classList]).toEqual(before)
        })

        it('should return the original input (chainable)', () => {
            dom.addClass(el, 'gauvain')

            const result = dom.removeClass(el, 'gauvain')
            expect(result).toBe(el)
        })
    })

    describe('toggleClass()', () => {
        it('should toggle classes to element', () => {
            const child = el.children[0]

            dom.toggleClass(child, 'foo')
            expect(child.classList.contains('foo')).toBe(true)

            dom.toggleClass(child, 'foo child1')
            expect(child.classList.contains('foo')).toBe(false)
            expect(child.classList.contains('child1')).toBe(false)
        })

        it('should handle empty string', () => {
            el.classList.add('root')

            const before = [...el.classList]
            dom.toggleClass(el, '')
            expect([...el.classList]).toEqual(before)
        })
    })

    describe('hasClass()', () => {
        it('should return true if element has all classes', () => {
            const child = el.children[0]
            expect(dom.hasClass(child, 'child child0')).toBe(true)
            expect(dom.hasClass(child, 'notexists')).toBe(false)
        })

        it('should handle empty string', () => {
            expect(dom.hasClass(el, '')).toBe(false)
        })
    })

    describe('append()', () => {
        it('should append a child to an element', () => {
            const div = document.createElement('div')

            dom.append(el, div)
            expect(el.lastElementChild).toBe(div)
        })

        it('should append multiple children', () => {
            const c1 = document.createElement('span')
            const c2 = document.createElement('span')

            dom.append(el, c1, c2)

            expect(el.children).toHaveLength(5)
            expect(el.lastElementChild).toBe(c2)
        })

        it('should append a child to an element from an HTML string', () => {
            const html = '<span>test</span>'

            dom.append(el, html)

            const span = el.lastElementChild

            expect(span).not.toBeNull()
            expect(span.tagName).toBe('SPAN')
            expect(span.textContent).toBe('test')
        })
    })

    describe('prepend()', () => {
        it('should prepend a child to an element', () => {
            const div = document.createElement('div')

            dom.prepend(el, div)
            expect(el.firstElementChild).toBe(div)
        })

        it('should prepend multiple children', () => {
            const c1 = document.createElement('span')
            const c2 = document.createElement('span')

            dom.prepend(el, c1, c2)

            expect(el.children).toHaveLength(5)
            expect(el.firstElementChild).toBe(c1)
            expect(el.firstElementChild.nextElementSibling).toBe(c2)
        })

        it('should accept children as HTML string', () => {
            const c1 = '<span class="c1">'
            const c2 = '<span class="c2">'

            dom.prepend(el, c1, c2)

            expect(el.children).toHaveLength(5)
            expect(el.firstElementChild).toHaveClass('c1')
            expect(el.firstElementChild.nextElementSibling).toHaveClass('c2')
        })

        it('should append a child to an element from an HTML string', () => {
            const html = '<span>test</span>'

            dom.prepend(el, html)

            const span = el.firstElementChild

            expect(span).not.toBeNull()
            expect(span.tagName).toBe('SPAN')
            expect(span.textContent).toBe('test')
        })
    })

    describe('remove()', () => {
        it('should remove an element', () => {
            const child = el.children[0]

            dom.remove(child)
            expect(el.children).toHaveLength(2)
        })

        it('should remove multiple elements', () => {
            const child1 = el.children[0]
            const child2 = el.children[1]

            dom.remove(el, child1, child2)

            expect(el.children).toHaveLength(1)
        })

        it('should remove multiple elements from a an Array-Like object', () => {
            const children = el.querySelectorAll('.child')

            dom.remove(el, children)

            expect(el.children).toHaveLength(0)
        })

        it('should remove Elements from string selector', () => {
            dom.remove('.child0')

            expect(el.children).toHaveLength(2)
        })
    })

    describe('closest()', () => {
        it('should return the closest element', () => {
            const child = el.children[0]
            const grandchild = child.children[0]

            expect(dom.closest(grandchild, '#root')).toBe(el)
            expect(dom.closest(grandchild, '.grandchild')).toBe(grandchild)
            expect(dom.closest(grandchild)).toBe(grandchild)
        })

        it('should return the closest element using a selector string', () => {
            const child = el.children[0]
            const grandchild = child.children[0]

            expect(dom.closest(grandchild, '#root')).toBe(el)
            expect(dom.closest(grandchild, '.child')).toBe(child)
            expect(dom.closest(grandchild, '.grandchild')).toBe(grandchild)
        })

        it('should return the element itself if selector is undefined', () => {
            const child = el.children[0]
            const grandchild = child.children[0]

            expect(dom.closest(grandchild)).toBe(grandchild)
        })

        it('should return the matching ancestor when selector is an Element', () => {
            const child = el.children[0]
            const grandchild = child.children[0]

            expect(dom.closest(grandchild, child)).toBe(child)
            expect(dom.closest(grandchild, el)).toBe(el)
        })

        it('should return the element itself if selector is the same Element', () => {
            const child = el.children[0]

            expect(dom.closest(child, child)).toBe(child)
        })

        it('should return null if no matching ancestor is found (Element selector)', () => {
            const child = el.children[0]
            const grandchild = child.children[0]

            const outside = document.createElement('div')
            document.body.append(outside)

            expect(dom.closest(grandchild, outside)).toBeNull()
        })

        it('should return null if no matching ancestor is found (string selector)', () => {
            const child = el.children[0]
            const grandchild = child.children[0]

            expect(dom.closest(grandchild, '.does-not-exist')).toBeNull()
        })
    })

    describe('next()', () => {
        it('should return the immediate next element matching selector', () => {
            const child = el.children[0]

            expect(dom.next(child)).toBe(el.children[1])
            expect(dom.next(child, '.child1')).toBe(el.children[1])
            expect(dom.next(child, '.child2')).toBeNull()
        })

        it('should return null if there is no next element', () => {
            const child1 = el.children[0]
            const child3 = el.children[2]

            expect(dom.next(child3)).toBe(null)
            expect(dom.next(child1, '.notexists')).toBe(null)
        })
    })

    describe('prev()', () => {
        it('should return the immediate previous element matching selector', () => {
            const child1 = el.children[1]
            const child2 = el.children[2]

            expect(dom.prev(child2)).toBe(child1)
            expect(dom.prev(child2, '.child1')).toBe(child1)
            expect(dom.prev(child2, '.child0')).toBeNull()
        })

        it('should return null if there is no previous element', () => {
            const child1 = el.children[0]
            const child3 = el.children[2]

            expect(dom.prev(child1)).toBe(null)
            expect(dom.prev(child3, '.notexists')).toBe(null)
        })
    })

    describe('nextUntil() / prevUntil()', () => {
        let children

        beforeEach(() => {
            children = el.querySelectorAll('.child')
        })

        describe('nextUntil()', () => {
            it('should collect next siblings until selector matches (string)', () => {
                const result = dom.nextUntil(children[0], '.child2')
                expect(result).toEqual([children[1]])
            })

            it('should stop immediately if next sibling matches selector', () => {
                const result = dom.nextUntil(children[1], '.child2')
                expect(result).toEqual([])
            })

            it('should work with Element selector', () => {
                const result = dom.nextUntil(children[0], children[2])
                expect(result).toEqual([children[1]])
            })

            it('should return all next siblings if selector never matches', () => {
                const result = dom.nextUntil(children[0], '.does-not-exist')
                expect(result).toEqual([children[1], children[2]])
            })

            it('should return empty array if no next siblings', () => {
                const result = dom.nextUntil(children[2], '.child0')
                expect(result).toEqual([])
            })
        })

        describe('prevUntil()', () => {
            it('should collect previous siblings until selector matches (string)', () => {
                const result = dom.prevUntil(children[2], '.child0')
                expect(result).toEqual([children[1]])
            })

            it('should stop immediately if previous sibling matches selector', () => {
                const result = dom.prevUntil(children[1], '.child0')
                expect(result).toEqual([])
            })

            it('should work with Element selector', () => {
                const result = dom.prevUntil(children[2], children[0])
                expect(result).toEqual([children[1]])
            })

            it('should return all previous siblings if selector never matches', () => {
                const result = dom.prevUntil(children[2], '.does-not-exist')
                expect(result).toEqual([children[1], children[0]])
            })

            it('should return empty array if no previous siblings', () => {
                const result = dom.prevUntil(children[0], '.child2')
                expect(result).toEqual([])
            })
        })
    })

    describe('nextAll()', () => {
        it('should return every elements next to an element', () => {
            const child = el.children[0]

            expect(dom.nextAll(child)).toHaveLength(2)
            expect(dom.nextAll(child, '.child')).toHaveLength(2)
            expect(dom.nextAll(child, '.child2')).toHaveLength(1)
        })

        it('should return an empty list if there is no next element', () => {
            const child1 = el.children[0]
            const child3 = el.children[2]

            expect(dom.nextAll(child3)).toHaveLength(0)
            expect(dom.nextAll(child1, '.notexists')).toHaveLength(0)
        })
    })

    describe('prevAll()', () => {
        it('should return every elements previous to an element', () => {
            const child3 = el.children[2]

            expect(dom.prevAll(child3)).toHaveLength(2)
            expect(dom.prevAll(child3, '.child')).toHaveLength(2)
            expect(dom.prevAll(child3, '.child1')).toHaveLength(1)
        })

        it('should return an empty list if there is no previous element', () => {
            const child1 = el.children[0]
            const child3 = el.children[2]

            expect(dom.prevAll(child1)).toHaveLength(0)
            expect(dom.prevAll(child3, '.notexists')).toHaveLength(0)
        })
    })

    describe('wrap()', () => {
        it('should wrap a child element with a wrapper', () => {
            const child = el.querySelector('.child1')
            const wrapper = document.createElement('div')
            wrapper.className = 'wrapper'

            dom.wrap(child, wrapper)

            expect(el.children[1]).toBe(wrapper)

            expect(wrapper.firstElementChild).toBe(child)
        })

        it('should insert wrapper before element when wrapper is not connected', () => {
            const child = el.querySelector('.child1')
            const wrapper = document.createElement('div')

            expect(wrapper.isConnected).toBe(false) // état initial

            dom.wrap(child, wrapper)

            expect(wrapper.isConnected).toBe(true)

            expect(el.children[1]).toBe(wrapper)

            expect(wrapper.firstElementChild).toBe(child)
        })

        it('should not insert wrapper before element if wrapper is already connected', () => {
            const child = el.querySelector('.child1')

            const wrapper = document.createElement('div')
            document.body.append(wrapper)

            dom.wrap(child, wrapper)

            expect(wrapper.parentNode).toBe(document.body)
            expect(wrapper.firstElementChild).toBe(child)
            expect(el.querySelector('.child1')).toBeNull() // child a quitté el
        })
    })

    describe('attr()', () => {
        it('should read an attribute', () => {
            const child = el.querySelector('.child0')
            child.setAttribute('data-test', 'hello')

            expect(dom.attr(child, 'data-test')).toBe('hello')
        })

        it('should set an attribute', () => {
            const child = el.querySelector('.child1')

            const ret = dom.attr(child, 'data-test', 'world')

            expect(child.getAttribute('data-test')).toBe('world')
        })

        it('should remove attribute when value is null', () => {
            const child = el.querySelector('.child2')
            child.setAttribute('data-test', 'bye')

            dom.attr(child, 'data-test', null)

            expect(child.hasAttribute('data-test')).toBe(false)
        })

        it('should return null when attribute does not exist', () => {
            const child = el.querySelector('.child0')

            expect(dom.attr(child, 'data-unknown')).toBeNull()
        })
    })

    describe('prop()', () => {
        it('should read a property', () => {
            const child = el.querySelector('.child0')
            child.customValue = 42

            expect(dom.prop(child, 'customValue')).toBe(42)
        })

        it('should set a property', () => {
            const child = el.querySelector('.child1')

            const ret = dom.prop(child, 'perceval', 'c pas faux')

            expect(child.perceval).toBe('c pas faux')
            expect(ret).toBe(child)
        })

        it('should reflect live DOM state', () => {
            const input = document.createElement('input')
            document.body.append(input)

            input.value = 'abc'

            expect(dom.prop(input, 'value')).toBe('abc')
        })

        it('attr and prop should differ for input value', () => {
            const input = document.createElement('input')
            input.setAttribute('value', 'perceval')
            document.body.append(input)

            input.value = 'karadoc'

            expect(dom.attr(input, 'value')).toBe('perceval')
            expect(dom.prop(input, 'value')).toBe('karadoc')
        })
    })

    describe('html()', () => {
        it('should return innerHTML when no value provided', () => {
            const child = el.querySelector('.child0')
            child.innerHTML = '<span>On en a gros</span>'
            expect(dom.html(child)).toBe('<span>On en a gros</span>')
        })

        it('should set innerHTML', () => {
            const child = el.querySelector('.child1')
            dom.html(child, '<b>On en a gros</b>')
            expect(child.innerHTML).toBe('<b>On en a gros</b>')
        })

        it('should overwrite existing HTML', () => {
            const child = el.querySelector('.child2')
            child.innerHTML = '<i>On en a gros</i>'

            dom.html(child, '<u>c pas faux</u>')

            expect(child.innerHTML).toBe('<u>c pas faux</u>')
        })
    })

    describe('text()', () => {
        it('should return innerText when no value provided', () => {
            const child = el.querySelector('.child0')
            child.innerText = 'On en a gros'

            expect(dom.text(child)).toBe('On en a gros')
        })

        it('should set innerText', () => {
            const child = el.querySelector('.child1')
            dom.text(child, 'On en a gros')
            expect(child.innerText).toBe('On en a gros')
        })

        it('should overwrite existing text', () => {
            const child = el.querySelector('.child2')
            child.innerText = 'On en a gros'

            dom.text(child, 'c pas faux')

            expect(child.innerText).toBe('c pas faux')
        })
    })

    describe('hide()', () => {
        it('should set display to none', () => {
            dom.hide(el)
            expect(el.style.display).toBe('none')
        })

        it('should store previous computed display value', () => {
            el.style.display = 'inline-block'
            dom.hide(el)

            expect(dom.data(el, '__display__')).toBe('inline-block')
        })

        it('should not overwrite stored display if already hidden once', () => {
            el.style.display = 'flex'
            dom.hide(el)
            dom.hide(el)

            expect(dom.data(el, '__display__')).toBe('flex')
        })

        it('should return the element', () => {
            expect(dom.hide(el)).toBe(el)
        })
    })

    describe('show()', () => {
        it('should restore previous display value', () => {
            el.style.display = 'grid'
            dom.hide(el)
            dom.show(el)

            expect(el.style.display).toBe('grid')
        })

        it('should remove stored display data after restoring', () => {
            el.style.display = 'block'
            dom.hide(el)
            dom.show(el)

            expect(dom.data(el, '__display__')).toBeUndefined()
        })

        it('should remove inline display if no stored value exists', () => {
            el.style.display = 'none'
            dom.show(el)

            expect(el.style.display).toBe('')
        })

        it('should return the element', () => {
            expect(dom.show(el)).toBe(el)
        })
    })

    describe('toggle()', () => {
        it('should hide element if currently visible', () => {
            el.style.display = ''
            dom.toggle(el)

            expect(el.style.display).toBe('none')
        })

        it('should show element if currently hidden', () => {
            el.style.display = 'none'
            dom.toggle(el)

            expect(el.style.display).not.toBe('none')
        })

        it('should restore original display after hide → toggle', () => {
            el.style.display = 'inline'
            dom.hide(el)
            dom.toggle(el)

            expect(el.style.display).toBe('inline')
        })

        it('should return the element', () => {
            expect(dom.toggle(el)).toBe(el)
        })
    })

    describe('data()', () => {
        it('should return dataset when called without arguments', () => {
            el.dataset.test = '123'
            expect(dom.data(el)).toBe(el.dataset)
        })

        it('should set a single data value', () => {
            dom.data(el, 'foo', 'bar')
            expect(el.dataset.foo).toBe('bar')
        })

        it('should get a single data value', () => {
            el.dataset.foo = 'bar'
            expect(dom.data(el, 'foo')).toBe('bar')
        })

        it('should accept "data-*" attribute name', () => {
            dom.data(el, 'data-user-id', '42')
            expect(el.dataset.userId).toBe('42')
        })

        it('should camelCase keys automatically', () => {
            dom.data(el, 'user-id', '99')
            expect(el.dataset.userId).toBe('99')
        })

        it('should set multiple values from object', () => {
            dom.data(el, { a: '1', b: '2' })
            expect(el.dataset.a).toBe('1')
            expect(el.dataset.b).toBe('2')
        })

        it('should remove data when value is null', () => {
            el.dataset.temp = 'yes'
            dom.data(el, 'temp', null)
            expect(el.dataset.temp).toBeUndefined()
        })

        it('should return element when setting values (chainable)', () => {
            const result = dom.data(el, 'foo', 'bar')
            expect(result).toBe(el)
        })

        it('should return undefined for unknown key', () => {
            expect(dom.data(el, 'doesNotExist')).toBeUndefined()
        })
    })

    describe('removeData()', () => {
        it('should remove data by key', () => {
            el.dataset.foo = 'bar'
            dom.removeData(el, 'foo')
            expect(el.dataset.foo).toBeUndefined()
        })

        it('should accept "data-*" attribute name', () => {
            el.dataset.userId = '42'
            dom.removeData(el, 'data-user-id')
            expect(el.dataset.userId).toBeUndefined()
        })

        it('should camelCase keys automatically', () => {
            el.dataset.userId = '99'
            dom.removeData(el, 'user-id')
            expect(el.dataset.userId).toBeUndefined()
        })

        it('should return element (chainable)', () => {
            const result = dom.removeData(el, 'foo')
            expect(result).toBe(el)
        })
    })

    describe('css()', () => {
        it('should get computed style value', () => {
            el.style.width = '123px'
            expect(dom.css(el, 'width')).toBe('123px')
        })

        it('should set a single style', () => {
            dom.css(el, 'height', '50px')
            expect(el.style.height).toBe('50px')
        })

        it('should set multiple styles from object', () => {
            dom.css(el, { width: '10px', height: '20px' })
            expect(el.style.width).toBe('10px')
            expect(el.style.height).toBe('20px')
        })

        it('should accept numeric values for px properties', () => {
            dom.css(el, 'width', 42)
            expect(el.style.width === '42px' || el.style.width === '42').toBe(true)
        })

        it('should return empty string for unknown property', () => {
            expect(dom.css(el, 'not-exists')).toBe('')
        })

        it('should set CSS custom properties (--var)', () => {
            dom.css(el, '--my-color', 'blue')
            expect(el.style.getPropertyValue('--my-color')).toBe('blue')
        })
    })

    describe('closestFind()', () => {
        it('should return an array of matches', () => {
            const grandChild0 = el.querySelectorAll('.grandchild0').item(0)
            const children = dom.closestFind(grandChild0, '#root', '.child')

            expect(children).toHaveLength(3)
        })

        it('should return empty array when nothing found', () => {
            const grandChild0 = el.querySelectorAll('.grandchild0').item(0)
            const res = dom.closestFind(grandChild0, '#root', '.notExists')
            expect(res).toEqual([])
        })

        it('should return empty array when closest is not found', () => {
            const grandChild0 = el.querySelectorAll('.grandchild0').item(0)
            const res = dom.closestFind(grandChild0, '#notexists', '.child')
            expect(res).toEqual([])
        })
    })

    describe('closestFindOne()', () => {
        it('should return first match inside closest ancestor', () => {
            const grandChild0 = el.querySelectorAll('.grandchild0')[1]
            const child = el.querySelectorAll('.child').item(0)
            expect(dom.closestFindOne(grandChild0, '#root', '.child')).toBe(child)
        })

        it('should return null when nothing found', () => {
            const grandChild0 = el.querySelectorAll('.grandchild0').item(0)
            expect(dom.closestFindOne(grandChild0, '#root', '.notExists')).toEqual(null)
            expect(dom.closestFindOne(grandChild0, '#notExist', '.child')).toEqual(null)
        })
    })

    describe('first()', () => {
        it('should return first element', () => {
            const firstChild = el.firstElementChild
            expect(dom.first(el.children)).toBe(firstChild)
        })

        it('should return null if no children', () => {
            dom.empty(el)
            expect(dom.first(el.children)).toBe(null)
        })

        it('should return element if element is specified', () => {
            expect(dom.first(el)).toBe(el)
        })
    })

    describe('last()', () => {
        it('should return last element', () => {
            const lastChild = el.lastElementChild
            expect(dom.last(el.children)).toBe(lastChild)
        })

        it('should return null if no children', () => {
            dom.empty(el)
            expect(dom.last(el.children)).toBe(null)
        })

        it('should return element if element is specified', () => {
            expect(dom.last(el)).toBe(el)
        })
    })

    describe('create()', () => {
        it('should create element from tag name', () => {
            const div = dom.create('div')
            expect(div).toBeInstanceOf(Element)
            expect(div.tagName).toBe('DIV')
        })

        it('should create element from html string', () => {
            const node = dom.create('<span class="x"></span>')
            expect(node.tagName).toBe('SPAN')
            expect(node.classList.contains('x')).toBe(true)
        })

        it('should support html with multiple root nodes (returns DocumentFragment)', () => {
            const node = dom.create('<span class="a"></span><span class="b"></span>')
            expect(node).toBeInstanceOf(DocumentFragment)
            expect(node.children).toHaveLength(2)
        })

        it('should return null with invalid nodes', () => {
            expect(dom.create(null)).toBe(null)
        })
    })

    describe('eq()', () => {
        it('should return nth element from list', () => {
            const children = el.querySelectorAll('.child')
            expect(dom.eq(children, 1).classList.contains('child1')).toBe(true)
        })

        it('should accept negative index', () => {
            const children = el.querySelectorAll('.child')
            expect(dom.eq(children, -2).classList.contains('child1')).toBe(true)
        })

        it('should accept no index and return first element', () => {
            const children = el.querySelectorAll('.child')
            expect(dom.eq(children).classList.contains('child0')).toBe(true)
        })

        it('should return null if out of bounds', () => {
            const children = el.querySelectorAll('.child')
            expect(dom.eq(children, 10)).toBe(null)
            expect(dom.eq(children, -10)).toBe(null)
        })
    })

    describe('after()', () => {
        it('should insert node after reference node', () => {
            const ref = document.createElement('span')
            ref.className = 'ref'
            const newEl = document.createElement('span')
            newEl.className = 'new'

            el.append(ref)
            dom.after(ref, newEl)

            expect(ref.nextElementSibling).toBe(newEl)
        })

        it('should insert HTML string as a node after reference node', () => {
            const ref = document.createElement('span')
            ref.className = 'ref'
            const newEl = '<div class="perceval"></div>'

            el.append(ref)
            dom.after(ref, newEl)

            expect(ref.nextElementSibling).toHaveClass('perceval')
        })

        it('should not insert a node on document', () => {
            const newEl = document.createElement('span')
            expect(dom.after(document, newEl)).toBe(null)
        })
    })

    describe('before()', () => {
        it('should insert node before reference node', () => {
            const ref = document.createElement('span')
            ref.className = 'ref'
            const newEl = document.createElement('span')
            newEl.className = 'new'

            el.append(ref)
            dom.before(ref, newEl)

            expect(ref.previousElementSibling).toBe(newEl)
        })

        it('should insert HTML string as a node after reference node', () => {
            const ref = document.createElement('span')
            ref.className = 'ref'
            const newEl = '<div class="perceval"></div>'

            el.append(ref)
            dom.before(ref, newEl)

            expect(ref.previousElementSibling).toHaveClass('perceval')
        })

        it('should not insert a node on document', () => {
            const newEl = document.createElement('span')
            expect(dom.before(document, newEl)).toBe(null)
        })
    })

    describe('empty()', () => {
        it('should remove all children', () => {
            el.innerHTML = `<span></span><span></span>`
            dom.empty(el)
            expect(el.children).toHaveLength(0)
            expect(el.innerHTML).toBe('')
        })

        it('should keep node itself', () => {
            dom.empty(el)
            expect(el).toBeInstanceOf(Element)
        })
    })

    describe('not()', () => {
        it('should filter out elements matching selector', () => {
            el.innerHTML = `<span class="a"></span><span class="b"></span><span class="a"></span>`
            const list = Array.from(el.querySelectorAll('span'))

            const filtered = dom.not(list, '.a')
            expect(filtered).toHaveLength(1)
            expect(filtered[0].classList.contains('b')).toBe(true)
        })

        it('should accept an array-like', () => {
            el.innerHTML = `<span class="a"></span><span class="b"></span><span class="a"></span>`
            const list = el.querySelectorAll('span')

            const filtered = dom.not(list, '.a')
            expect(filtered).toHaveLength(1)
            expect(filtered[0].classList.contains('b')).toBe(true)
        })

        it('should accept an single element', () => {
            const filtered = dom.not(el, '.a')
            expect(filtered).toHaveLength(1)
        })

        it('should accept elements as selector', () => {
            const children = el.querySelectorAll('.child')
            const child1 = el.querySelector('.child1')
            const filtered = dom.not(children, child1)
            expect(filtered).toHaveLength(2)
        })
    })

    describe('collide()', () => {
        it('should detect collision between 2 elements', () => {
            const [el1, el2] = Array.from(el.querySelectorAll('.child'))

            el1.getBoundingClientRect = jest.fn(() => ({ x: 0, y: 0, height: 100, width: 200 }))
            el2.getBoundingClientRect = jest.fn(() => ({ x: 50, y: 50, height: 100, width: 200 }))

            expect(dom.collide(el1, el2)).toBe(true)
        })

        it('should return false when separated', () => {
            const [el1, el2] = Array.from(el.querySelectorAll('.child'))

            el1.getBoundingClientRect = jest.fn(() => ({ x: 0, y: 0, height: 100, width: 200 }))
            el2.getBoundingClientRect = jest.fn(() => ({
                x: 500,
                y: 500,
                height: 100,
                width: 200,
            }))

            expect(dom.collide(el1, el2)).toBe(false)
        })

        it('should consider touching edges not as collision', () => {
            const [el1, el2] = Array.from(el.querySelectorAll('.child'))

            el1.getBoundingClientRect = jest.fn(() => ({ x: 0, y: 0, height: 100, width: 200 }))
            el2.getBoundingClientRect = jest.fn(() => ({
                x: 200,
                y: 100,
                height: 100,
                width: 200,
            }))

            expect(dom.collide(el1, el2)).toBe(false)
        })
    })

    describe('matches()', () => {
        it('should return true when element matches selector', () => {
            el.innerHTML = `<span class="a"></span>`
            const node = el.querySelector('span')
            expect(dom.matches(node, '.a')).toBe(true)
            expect(dom.matches(node, '.b')).toBe(false)
        })

        it('should return true for element', () => {
            expect(dom.matches(el, el)).toBe(true)
        })

        it('should return false for non-element', () => {
            expect(dom.matches(null, '.a')).toBe(false)
        })
    })

    describe('replaceChild()', () => {
        it('should replace a child with another node', () => {
            el.innerHTML = `<span class="old"></span>`
            const oldEl = el.querySelector('.old')
            const newEl = document.createElement('span')
            newEl.className = 'new'

            dom.replaceChild(el, newEl, oldEl)
            expect(el.querySelector('.new')).toBe(newEl)
            expect(el.querySelector('.old')).toBe(null)
        })
    })

    describe('replaceChildren()', () => {
        it('should replace all children', () => {
            el.innerHTML = `<span class="a"></span><span class="b"></span>`

            const n1 = document.createElement('span')
            n1.className = 'x'
            const n2 = document.createElement('span')
            n2.className = 'y'

            dom.replaceChildren(el, n1, n2)

            expect(el.children).toHaveLength(2)
            expect(el.children[0]).toBe(n1)
            expect(el.children[1]).toBe(n2)
        })

        it('should accept html string children', () => {
            dom.replaceChildren(el, '<span class="x"></span>', '<span class="y"></span>')
            expect(el.querySelector('.x')).toBeTruthy()
            expect(el.querySelector('.y')).toBeTruthy()
        })
    })

    describe('offset()', () => {
        it('should return scroll offsets for window', () => {
            Object.defineProperty(window, 'scrollX', { value: 12, configurable: true })
            Object.defineProperty(window, 'scrollY', { value: 34, configurable: true })

            const o = dom.offset(window)
            expect(o.left).toBe(12)
            expect(o.top).toBe(34)
        })

        it('should return scroll offsets for document', () => {
            Object.defineProperty(document.documentElement, 'scrollLeft', {
                value: 10,
                configurable: true,
            })
            Object.defineProperty(document.documentElement, 'scrollTop', {
                value: 20,
                configurable: true,
            })

            const o = dom.offset(document)
            expect(o.left).toBe(10)
            expect(o.top).toBe(20)
        })

        it('should return offset for element based on bounding rect', () => {
            const child = document.createElement('div')
            el.append(child)

            child.getBoundingClientRect = jest.fn(() => ({ top: 100, left: 200 }))

            Object.defineProperty(window, 'scrollX', { value: 3, configurable: true })
            Object.defineProperty(window, 'scrollY', { value: 7, configurable: true })

            const o = dom.offset(child)
            expect(o.left).toBe(203)
            expect(o.top).toBe(107)
        })
    })

    describe('dom.isEditable', () => {
        it('should return true for input', () => {
            const el = document.createElement('input')
            expect(dom.isEditable(el)).toBe(true)
        })

        it('should return true for textarea', () => {
            const el = document.createElement('textarea')
            expect(dom.isEditable(el)).toBe(true)
        })

        it('should return true for select', () => {
            const el = document.createElement('select')
            expect(dom.isEditable(el)).toBe(true)
        })

        it('should return true for contenteditable div', () => {
            const el = document.createElement('div')
            el.setAttribute('contenteditable', 'true')
            expect(dom.isEditable(el)).toBe(true)
        })

        it('should return true for nested element inside contenteditable', () => {
            const parent = document.createElement('div')
            parent.setAttribute('contenteditable', 'true')

            const child = document.createElement('span')
            parent.appendChild(child)

            expect(dom.isEditable(child)).toBe(true)
        })

        it('should return false for normal div', () => {
            const el = document.createElement('div')
            expect(dom.isEditable(el)).toBe(false)
        })

        it('should return false for button', () => {
            const el = document.createElement('button')
            expect(dom.isEditable(el)).toBe(false)
        })

        it('should return false for span', () => {
            const el = document.createElement('span')
            expect(dom.isEditable(el)).toBe(false)
        })

        it('should return false for element with contenteditable="false"', () => {
            const el = document.createElement('div')
            el.setAttribute('contenteditable', 'false')
            expect(dom.isEditable(el)).toBe(false)
        })

        it('should return true for Text Node in editable container', () => {
            const el = document.createElement('div')
            const textNode = document.createTextNode('c pas faux')
            el.appendChild(textNode)
            el.setAttribute('contenteditable', 'true')

            expect(dom.isEditable(textNode)).toBe(true)
        })

        it('should return true for invalid node', () => {
            expect(dom.isEditable(null)).toBe(false)
        })
    })

    describe('isInDOM', () => {
        let child, grandchild

        beforeEach(() => {
            child = el.querySelector('.child0')
            grandchild = child.querySelector('.grandchild0')
        })

        it('should return true for element attached to DOM', () => {
            expect(dom.isInDOM(el)).toBe(true)
        })

        it('should return true for nested child element', () => {
            expect(dom.isInDOM(child)).toBe(true)
        })

        it('should return true for deeply nested element', () => {
            expect(dom.isInDOM(grandchild)).toBe(true)
        })

        it('should return false for detached element', () => {
            const detached = document.createElement('div')
            expect(dom.isInDOM(detached)).toBe(false)
        })

        it('should return false for element removed from DOM', () => {
            const toRemove = el.querySelector('.child1')
            toRemove.remove()
            expect(dom.isInDOM(toRemove)).toBe(false)
        })

        it('should return false for non-Node values', () => {
            expect(dom.isInDOM(null)).toBe(false)
            expect(dom.isInDOM(undefined)).toBe(false)
            expect(dom.isInDOM({})).toBe(false)
            expect(dom.isInDOM('div')).toBe(false)
        })

        it('should return false for DocumentFragment not attached to document', () => {
            const fragment = document.createDocumentFragment()
            const fragChild = document.createElement('div')
            fragment.appendChild(fragChild)

            expect(dom.isInDOM(fragChild)).toBe(false)
        })
    })

    describe('on(), off()', () => {
        it('should attach an event listener', () => {
            const handler = jest.fn()

            dom.on(el, 'click', handler)

            el.dispatchEvent(new MouseEvent('click'))

            expect(handler).toHaveBeenCalledTimes(1)

            const wrapped = handler.mock.calls[0][0]
            expect(wrapped).toEqual(expect.any(Object))
            expect(wrapped.originalEvent).toEqual(expect.any(MouseEvent))
        })

        it('should attach an event listener on document', () => {
            const handler = jest.fn()

            dom.on(document, 'mousemove', handler)

            document.dispatchEvent(new MouseEvent('mousemove'))

            expect(handler).toHaveBeenCalledTimes(1)

            const wrapped = handler.mock.calls[0][0]
            expect(wrapped).toEqual(expect.any(Object))
            expect(wrapped.originalEvent).toEqual(expect.any(MouseEvent))
        })

        it('should detach an event listener', () => {
            const handler = jest.fn()

            dom.on(el, 'click', handler)
            dom.off(el, 'click', handler)

            el.dispatchEvent(new MouseEvent('click'))

            expect(handler).not.toHaveBeenCalled()
        })

        it('should handle when no event has been on', () => {
            const handler = jest.fn()

            dom.off(el, 'click', handler)

            expect(handler).not.toHaveBeenCalled()
        })

        it('should support multiple events', () => {
            const handler = jest.fn()

            dom.on(el, 'click mouseenter', handler)

            el.dispatchEvent(new MouseEvent('click'))
            el.dispatchEvent(new MouseEvent('mouseenter'))

            expect(handler).toHaveBeenCalledTimes(2)
        })

        it('should remove handler for multiple events', () => {
            const handler = jest.fn()

            dom.on(el, 'click mouseenter', handler, true)
            dom.off(el, 'click mouseenter', handler, true)

            el.dispatchEvent(new MouseEvent('click'))
            el.dispatchEvent(new MouseEvent('mouseenter'))

            expect(handler).not.toHaveBeenCalled()
        })

        it('should call handler when delegated target matches selector', () => {
            const handler = jest.fn()

            const child1 = el.querySelector('.child1')

            dom.on(el, 'click', '.child1', handler)

            child1.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(handler).toHaveBeenCalledTimes(1)

            const ev = handler.mock.calls[0][0]
            expect(ev.target).toBe(child1)
        })

        it('should not call handler when delegated target does not match selector', () => {
            const handler = jest.fn()

            const child2 = el.querySelector('.child2')

            dom.on(el, 'click', '.child1', handler)

            child2.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(handler).not.toHaveBeenCalled()
        })

        it('should match delegated selector on ancestors', () => {
            const handler = jest.fn()

            const deep = el.querySelector('.child1 .grandchild0')

            dom.on(el, 'click', '.child1', handler)

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should set currentTarget to matched element', () => {
            const handler = jest.fn()

            const deep = el.querySelector('.child1 .grandchild0')
            const child1 = el.querySelector('.child1')

            dom.on(el, 'click', '.child1', handler)

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            const ev = handler.mock.calls[0][0]
            expect(ev.currentTarget).toBe(child1)
            expect(ev.originalEvent).toBeInstanceOf(MouseEvent)
        })

        it('should remove delegated handler only', () => {
            const h1 = jest.fn()
            const h2 = jest.fn()

            const deep = el.querySelector('.child1 .grandchild0')

            dom.on(el, 'click', '.child1', h1)
            dom.on(el, 'click', '.child1', h2)

            dom.off(el, 'click', '.child1', h1)

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(h1).not.toHaveBeenCalled()
            expect(h2).toHaveBeenCalledTimes(1)
        })

        it('should not remove dispatcher when other selectors still exist', () => {
            const h1 = jest.fn()
            const h2 = jest.fn()

            const deep1 = el.querySelector('.child1 .grandchild0')
            const deep2 = el.querySelector('.child2 .grandchild0')

            dom.on(el, 'click', '.child1', h1)
            dom.on(el, 'click', '.child2', h2)

            dom.off(el, 'click', '.child1', h1)

            deep2.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(h1).not.toHaveBeenCalled()
            expect(h2).toHaveBeenCalledTimes(1)
        })

        it('should remove all delegated handlers for selector', () => {
            const h1 = jest.fn()
            const h2 = jest.fn()

            const deep = el.querySelector('.child1 .grandchild0')

            dom.on(el, 'click', '.child1', h1)
            dom.on(el, 'click', '.child1', h2)

            dom.off(el, 'click', '.child1')

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(h1).not.toHaveBeenCalled()
            expect(h2).not.toHaveBeenCalled()
        })

        it('should not remove direct handler when removing delegated one', () => {
            const direct = jest.fn()
            const delegated = jest.fn()

            const deep = el.querySelector('.child1 .grandchild0')

            dom.on(el, 'click', direct)
            dom.on(el, 'click', '.child1', delegated)

            dom.off(el, 'click', '.child1', delegated)

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(direct).toHaveBeenCalledTimes(1)
            expect(delegated).not.toHaveBeenCalled()
        })

        it('should be safe to call off multiple times', () => {
            const handler = jest.fn()

            dom.on(el, 'click', handler)
            dom.off(el, 'click', handler)
            dom.off(el, 'click', handler)
            dom.off(el, 'click')

            el.dispatchEvent(new MouseEvent('click'))

            expect(handler).not.toHaveBeenCalled()
        })

        it('should bind same handler twice', () => {
            const handler = jest.fn()

            dom.on(el, 'click', handler)
            dom.on(el, 'click', handler)

            el.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(handler).toHaveBeenCalledTimes(2)
        })

        it('should remove all occurrences of handler', () => {
            const handler = jest.fn()

            dom.on(el, 'click', handler)
            dom.on(el, 'click', handler)

            dom.off(el, 'click', handler)

            el.dispatchEvent(new MouseEvent('click'))

            expect(handler).not.toHaveBeenCalled()
        })

        it('should call handlers in registration order', () => {
            const calls = []

            dom.on(el, 'click', () => calls.push(1))
            dom.on(el, 'click', () => calls.push(2))
            dom.on(el, 'click', () => calls.push(3))

            el.dispatchEvent(new MouseEvent('click'))

            expect(calls).toEqual([1, 2, 3])
        })

        it('should remove only handlers for given event', () => {
            const click = jest.fn()
            const enter = jest.fn()

            dom.on(el, 'click', click)
            dom.on(el, 'mouseenter', enter)

            dom.off(el, 'click')

            el.dispatchEvent(new MouseEvent('click'))
            el.dispatchEvent(new MouseEvent('mouseenter'))

            expect(click).not.toHaveBeenCalled()
            expect(enter).toHaveBeenCalledTimes(1)
        })

        it('should call handler for namespaced event', () => {
            const h = jest.fn()

            dom.on(el, 'click.ns', h)

            el.dispatchEvent(new MouseEvent('click'))

            expect(h).toHaveBeenCalledTimes(1)
        })

        it('should remove handler by event and namespace', () => {
            const h1 = jest.fn()
            const h2 = jest.fn()

            dom.on(el, 'click.ns1', h1)
            dom.on(el, 'click.ns2', h2)

            dom.off(el, 'click.ns1')

            el.dispatchEvent(new MouseEvent('click'))

            expect(h1).not.toHaveBeenCalled()
            expect(h2).toHaveBeenCalledTimes(1)
        })

        it('should remove all handlers for event regardless of namespace', () => {
            const h1 = jest.fn()
            const h2 = jest.fn()

            dom.on(el, 'click.ns2', h1)
            dom.on(el, 'click.ns1', h2)

            dom.off(el, 'click')

            el.dispatchEvent(new MouseEvent('click'))

            expect(h1).not.toHaveBeenCalled()
            expect(h2).not.toHaveBeenCalled()
        })

        it('should remove all handlers by namespace only', () => {
            const h1 = jest.fn()
            const h2 = jest.fn()

            dom.on(el, 'click.ns', h1)
            dom.on(el, 'mouseenter.ns', h2)

            dom.off(el, '.ns')

            el.dispatchEvent(new MouseEvent('click'))
            el.dispatchEvent(new MouseEvent('mouseenter'))

            expect(h1).not.toHaveBeenCalled()
            expect(h2).not.toHaveBeenCalled()
        })

        it('should dispatch longtap after delay', () => {
            const handler = jest.fn()
            dom.on(el, 'longtap', handler)

            jest.spyOn(Mouse, 'getViewportPosition').mockReturnValueOnce({ x: 10, y: 10 })

            dispatchTouch(el, 'touchstart')
            dispatchTouch(el, 'touchmove')

            jest.advanceTimersByTime(799)
            expect(handler).not.toHaveBeenCalled()

            jest.advanceTimersByTime(1)
            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should cancel longtap when finger moves too much', () => {
            const handler = jest.fn()
            dom.on(el, 'longtap', handler)

            jest.spyOn(Mouse, 'getViewportPosition')
                .mockReturnValueOnce({ x: 10, y: 10 })
                .mockReturnValueOnce({ x: 50, y: 50 })

            dispatchTouch(el, 'touchstart')
            dispatchTouch(el, 'touchmove')

            jest.advanceTimersByTime(800)

            expect(handler).not.toHaveBeenCalled()
        })

        it('should cancel longtap on touchend', () => {
            const handler = jest.fn()
            dom.on(el, 'longtap', handler)

            jest.spyOn(Mouse, 'getViewportPosition').mockReturnValueOnce({ x: 10, y: 10 })

            dispatchTouch(el, 'touchstart')
            dispatchTouch(el, 'touchend')

            jest.advanceTimersByTime(800)

            expect(handler).not.toHaveBeenCalled()
        })

        it('should dispatch dbltap on two taps within delay', () => {
            const handler = jest.fn()
            dom.on(el, 'dbltap', handler)

            jest.spyOn(Mouse, 'getViewportPosition')
                .mockReturnValueOnce({ x: 10, y: 10 })
                .mockReturnValueOnce({ x: 12, y: 12 })

            dispatchTouch(el, 'touchstart')
            jest.advanceTimersByTime(200)
            dispatchTouch(el, 'touchstart')

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should not dispatch dbltap if second tap is too far', () => {
            const handler = jest.fn()
            dom.on(el, 'dbltap', handler)

            jest.spyOn(Mouse, 'getViewportPosition')
                .mockReturnValueOnce({ x: 10, y: 10 })
                .mockReturnValueOnce({ x: 50, y: 50 })

            dispatchTouch(el, 'touchstart')
            jest.advanceTimersByTime(200)
            dispatchTouch(el, 'touchstart')

            expect(handler).not.toHaveBeenCalled()
        })

        it('should support delegated longtap', () => {
            const handler = jest.fn()
            const child1 = el.querySelector('.child1')

            dom.on(el, 'longtap', '.child1', handler)

            jest.spyOn(Mouse, 'getViewportPosition').mockReturnValueOnce({ x: 10, y: 10 })

            dispatchTouch(child1, 'touchstart')

            jest.advanceTimersByTime(800)

            expect(handler).toHaveBeenCalledTimes(1)

            const ev = handler.mock.calls[0][0]
            expect(ev.type).toBe('longtap')
            expect(ev.currentTarget).toBe(child1)
        })

        it('should not double bind longtap native listener', () => {
            const addSpy = jest.spyOn(document, 'addEventListener')

            const handler = () => {}

            dom.on(el, 'longtap', handler)
            dom.on(el, 'longtap', handler)

            const longtapBindings = addSpy.mock.calls.filter(
                ([eventName]) => eventName === 'touchstart',
            )

            expect(longtapBindings.length).toBe(1)
        })

        it('should remove all handlers when calling off(el)', () => {
            const h1 = jest.fn()
            const h2 = jest.fn()

            dom.on(el, 'click', h1)
            dom.on(el, 'click', '.child1', h2)

            dom.off(el)

            el.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(h1).not.toHaveBeenCalled()
            expect(h2).not.toHaveBeenCalled()
        })

        it('should handle events dispatched from a text node', () => {
            document.body.innerHTML = `
              <div id="root">
                <button id="btn">Click me</button>
              </div>
            `

            const root = document.getElementById('root')
            const btn = document.getElementById('btn')

            const handler = jest.fn()

            dom.on(root, 'click', 'button', handler)

            const textNode = btn.firstChild

            const event = new MouseEvent('click', { bubbles: true })

            textNode.dispatchEvent(event)

            expect(handler).toHaveBeenCalledTimes(1)
            expect(handler.mock.calls[0][0].target).toBe(textNode)
        })
    })

    describe('dom.on delegated events propagation', () => {
        let root, parent, child

        beforeEach(() => {
            document.body.innerHTML = `
              <div class="root">
                <div class="parent">
                  <div class="child">test</div>
                </div>
              </div>
            `

            root = document.querySelector('.root')
            parent = document.querySelector('.parent')
            child = document.querySelector('.child')
        })

        it('stopImmediatePropagation should prevents other delegated handlers on same container', () => {
            const calls = []

            dom.on(root, 'keydown', '.child', (ev) => {
                calls.push('child')
                ev.stopImmediatePropagation()
            })

            dom.on(root, 'keydown', '.parent', (ev) => {
                calls.push('parent')
            })

            const e = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
            child.dispatchEvent(e)

            expect(calls).toEqual(['child'])
        })

        it('stopPropagation should not prevent other delegated handlers on same element', () => {
            const calls = []

            dom.on(root, 'keydown', '.child', (ev) => {
                calls.push('child1')
            })

            dom.on(root, 'click', '.root', (ev) => {
                calls.push('click')
            })

            dom.on(root, 'keydown', '.child', (ev) => {
                ev.stopPropagation()
                calls.push('child2')
            })

            dom.on(root, 'keydown', '.parent', (ev) => {
                calls.push('parent')
            })

            const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
            child.dispatchEvent(ev)

            expect(calls).toEqual(['child1', 'child2'])
        })

        it('child shoult stop parent regardless of bind order', () => {
            const el = document.createElement('div')
            el.innerHTML = `<div class="parent"><div class="child"></div></div>`
            document.body.appendChild(el)

            const child = el.querySelector('.child')
            const calls = []

            dom.on(el, 'click', '.parent', () => calls.push('parent'))
            dom.on(el, 'click', '.child', (ev) => {
                calls.push('child1')
                ev.stopImmediatePropagation()
            })
            dom.on(el, 'click', '.child', (ev) => {
                calls.push('child2')
            })

            child.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(calls).toEqual(['child1'])
        })

        it('preventDefault should call native preventDefault', () => {
            const el = document.createElement('div')
            el.innerHTML = `<button class="btn"></button>`
            document.body.appendChild(el)

            const btn = el.querySelector('.btn')

            let defaultPreventedInsideHandler = false

            dom.on(el, 'click', '.btn', (ev) => {
                ev.preventDefault()
                defaultPreventedInsideHandler = ev.originalEvent.defaultPrevented
            })

            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            })

            btn.dispatchEvent(event)

            expect(defaultPreventedInsideHandler).toBe(true)
            expect(event.defaultPrevented).toBe(true)
        })

        it('should stop propagation on native events', () => {
            const calls = []

            dom.on(parent, 'click', '.child', () => {
                calls.push('dom.on:delegated-parent')
            })

            dom.on(parent, 'click', () => {
                calls.push('dom.on:direct-parent')
            })

            parent.addEventListener('click', () => {
                calls.push('native:parent')
            })

            root.addEventListener('click', () => {
                calls.push('native:root')
            })

            child.addEventListener('click', (ev) => {
                calls.push('native:child')
                ev.stopPropagation()
            })

            child.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

            expect(calls).toEqual(['native:child'])
        })

        it('should ignore event if propagation already stopped on same element', () => {
            const calls = []

            parent.addEventListener('click', (ev) => {
                ev.stopPropagation()
                calls.push('native:parent')
            })

            dom.on(parent, 'click', () => {
                calls.push('dom.on:parent')
            })

            parent.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(calls).toEqual(['native:parent'])
        })

        it('should stop dom.on internal propagation if native listener stops propagation before it reaches root', () => {
            const calls = []

            dom.on(root, 'click', '.child', () => {
                calls.push('dom.on:root-delegated')
            })

            parent.addEventListener('click', (ev) => {
                calls.push('native:parent-stop')
                ev.stopPropagation()
            })

            child.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

            expect(calls).toEqual(['native:parent-stop'])
        })
    })

    describe('dblclick prevention on touch devices', () => {
        beforeEach(() => {
            __resetCustomEventsForTests()
            jest.spyOn(is, 'isTouchDevice').mockReturnValue(true)
        })

        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('should attach a dblclick listener that blocks the event', () => {
            const spy = jest.spyOn(document, 'addEventListener')

            dom.on(document, 'dbltap', () => {})

            const dblclickCall = spy.mock.calls.find(([event]) => event === 'dblclick')

            expect(dblclickCall).toBeTruthy()

            const handler = dblclickCall[1]

            const ev = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
                stopImmediatePropagation: jest.fn(),
            }

            handler(ev)

            expect(ev.preventDefault).toHaveBeenCalled()
            expect(ev.stopPropagation).toHaveBeenCalled()
            expect(ev.stopImmediatePropagation).toHaveBeenCalled()
        })

        it('should not attach dblclick listener on non-touch devices', () => {
            is.isTouchDevice.mockReturnValue(false)

            const spy = jest.spyOn(document, 'addEventListener')

            dom.on(document, 'dbltap', () => {})

            expect(spy.mock.calls.find(([event]) => event === 'dblclick')).toBeUndefined()
        })
    })
})
