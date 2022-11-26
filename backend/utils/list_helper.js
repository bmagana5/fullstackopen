const logger = require('./logger');

const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const reducer = (total, current) => {
        return total + current.likes;
    };
    return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
    const reducer = (favoriteBlog, current) => {
        if (favoriteBlog !== null) {
            return favoriteBlog.likes >= current.likes 
                ? 
                { 
                    title: favoriteBlog.title, 
                    author: favoriteBlog.author, 
                    likes: favoriteBlog.likes
                } 
                : 
                {
                    title: current.title,
                    author: current.author,
                    likes: current.likes
                };
        }
        return {
            title: current.title,
            author: current.author,
            likes: current.likes
        };
    };
    return blogs.reduce(reducer, null);
};

const mostBlogs = (blogs) => {
    // 1. use reducer with initialized empty list
    // 2. go through blog list and read author of each blog
    // 3. if author not in accumulator list, add with blog count 1; otherwise, increment blog count by 1 for that author
    // 4. take this new list and use another reducer to get the author item with most blogs
    const authorBlogCount = blogs.reduce((authorList, current) => {
        const currentAuthor = authorList.find(item => item.author === current.author);
        if (currentAuthor) {
            return authorList.map(item => item.author === currentAuthor.author ? {...item, blogs: item.blogs + 1} : item);
        }
        return authorList.concat({ author: current.author, blogs: 1 });
    }, []);

    // logger.info('authorblogcount: ', authorBlogCount);

    return authorBlogCount.reduce((authorMostBlogs, current) => {
        if (authorMostBlogs !== null) {
            return authorMostBlogs.blogs >= current.blogs ? authorMostBlogs : current;
        }
        return current;
    }, null);
};

const mostLikes = (blogs) => {
    const authorLikesList = blogs.reduce((authorList, current) => {
        const currentAuthor = authorList.find(item => item.author === current.author);
        if (currentAuthor) {
            return authorList.map(item => item.author === currentAuthor.author ? {...item, likes: item.likes + current.likes} : item);
        }
        return authorList.concat({ author: current.author, likes: current.likes });
    }, []);

    return authorLikesList.reduce((authorMostLikes, current) => {
        if (authorMostLikes !== null) {
            return authorMostLikes.likes >= current.likes ? authorMostLikes : current;
        }
        return current;
    }, null);
};

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
};