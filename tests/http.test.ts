/**
 * @jest-environment node
 */

import webfHttp from '../src/http'

describe('Http', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    it('calls fetch with correct method', async () => {
        const fakeResponse: Response = {
            ok: true,
            status: 200,
            json: async () => ({ hello: 'world' }),
        } as Response;

        (global.fetch as jest.Mock).mockResolvedValue(fakeResponse)

        await webfHttp('/api/test')

        expect(fetch).toHaveBeenCalledWith(
            '/api/test',
            expect.objectContaining({
                method: 'GET'
            })
        )
    })
})
