const JSONUtils = require('./json-utils');

const JSON_FORMAT = {
    INLINE: 'inline',
    NESTING: 'nesting'
}

let mockNested, mockInline

beforeEach(() => {
    mockNested = {
        pages: {
            home: {
                title: 'Home Page'
            },
            news: {
                title: 'News'
            }
        }
    }

    mockInline = {
        "pages.home.title": 'Home Page',
        "pages.news.title": "News"
    }
});


describe('remove key', () => {
    test('removeKey - Nesting', () => {
        JSONUtils.removeKey(JSON_FORMAT.NESTING, mockNested, 'pages.news')
        expect( mockNested)
            .toEqual({
                pages: {
                    home: {
                        title: 'Home Page'
                    }
                }
            })
    })
    
    
    test('removeKey - Inline', () => {
        JSONUtils.removeKey(JSON_FORMAT.INLINE, mockInline, 'pages.news.title')
        expect( mockInline)
            .toEqual({
                "pages.home.title": 'Home Page',
            })
    })
});


describe('edit', () => {
    
    test('edit - Nesting', () => {
        JSONUtils.writeValue(JSON_FORMAT.NESTING, mockNested, 'pages.news.title', 'NEWSS')
        expect(mockNested).toEqual({
            pages: {
                home: {
                    title: 'Home Page'
                },
                news: {
                    title: 'NEWSS'
                }
            }
        })
    })


    test('edit - Inline', () => {
        JSONUtils.writeValue(JSON_FORMAT.INLINE, mockInline, 'pages.news.title', 'NEWSS')
        expect(mockInline).toEqual({
            "pages.home.title": 'Home Page',
            "pages.news.title": "NEWSS"
        })
    })

});

describe('add new', () => {
    it('add new - Nesting', () => {
        JSONUtils.writeValue(JSON_FORMAT.NESTING, mockNested, 'pages.about.title', 'About')
        expect(mockNested).toEqual({
            pages: {
                home: {
                    title: 'Home Page'
                },
                news: {
                    title: 'News'
                },
                about: {
                    title: 'About'
                }
            }
        })
    });

    it('add new - Inline', () => {
        JSONUtils.writeValue(JSON_FORMAT.INLINE, mockInline, 'pages.about.title', 'About')
        expect(mockInline).toEqual({
            "pages.home.title": 'Home Page',
            "pages.news.title": "News",
            "pages.about.title": "About"
        })
    });
});