const list_helper = require('../utils/list_helper');

const emptyBlogsList = [];
const blogListWithOne = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Patches\' Fun Times in a Box',
        author: 'Patches, the Cat',
        url: 'www.patchesofthesharingan.com',
        likes: 60,
        __v: 0
    }
];
const blogListWithMany = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }  
];

describe('dummy', () => {
    test('returns one', () => {
        const result = list_helper.dummy(emptyBlogsList);
        expect(result).toBe(1);
    });
});

describe('total likes', () => {
    test('of empty list is zero', () => {
        expect(list_helper.totalLikes([])).toBe(0);
    });

    test('when list has only one blog equals the likes of that blog', () => {
        expect(list_helper.totalLikes(blogListWithOne)).toBe(60);
    });

    test('of a list with more than one blog is calculated correctly', () => {
        expect(list_helper.totalLikes(blogListWithMany)).toBe(36);
    });
});

describe('favorite blog', () => {
    test('of empty list is null', () => {
        expect(list_helper.favoriteBlog(emptyBlogsList)).toEqual(null);
    });

    test('of list with one blog is that blog itself', () => {
        const oneBlog = {
            title: 'Patches\' Fun Times in a Box',
            author: 'Patches, the Cat',
            likes: 60
        };
        expect(list_helper.favoriteBlog(blogListWithOne)).toEqual(oneBlog);
    });

    test('of list with more than one blog is calculated correctly', () => {
        const favoriteBlogItem = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        };
        expect(list_helper.favoriteBlog(blogListWithMany)).toEqual(favoriteBlogItem);
    });
});

describe('author with most blogs', () => {
    test('in empty list is null', () => {
        expect(list_helper.mostBlogs(emptyBlogsList)).toEqual(null);
    });

    test('in list with one item is that sole author', () => {
        const authorBlogs = {
            author: 'Patches, the Cat',
            blogs: 1   
        };
        expect(list_helper.mostBlogs(blogListWithOne)).toEqual(authorBlogs);
    });

    test('in list with more than one is calculated correctly', () => {
        const authorBlogs = {
            author: 'Robert C. Martin',
            blogs: 3   
        };
        expect(list_helper.mostBlogs(blogListWithMany)).toEqual(authorBlogs);
    });
});

describe('author with most likes', () => {
    test('in empty list is null', () => {
        expect(list_helper.mostLikes(emptyBlogsList)).toEqual(null);
    });

    test('in list with one item is that sole author', () => {
        const authorLikes = {
            author: 'Patches, the Cat',
            likes: 60   
        };
        expect(list_helper.mostLikes(blogListWithOne)).toEqual(authorLikes);
    });

    test('in list with more than one is calculated correctly', () => {
        const authorLikes = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        };
        expect(list_helper.mostLikes(blogListWithMany)).toEqual(authorLikes);
    });
});