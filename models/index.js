var Sequelize = require('sequelize');
var marked = require('marked');

var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        //since we are searching, editing, deleting by urlTitle, these need to be unique
        unique: true
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        set: function (tags) {

            tags = tags || [];

            if (typeof tags === 'string') {
                tags = tags.split(',').map(function (str) {
                    return str.trim();
                });
            }

            this.setDataValue('tags', tags);

        }
    }
}, {
    getterMethods: {
        route: function () {
            return '/wiki/' + this.urlTitle;
        },
        renderedContent: function () {
            return marked(this.content);
        }
    },
});


Page.hook('beforeValidate', function (page) {
    if (page.title) {
        page.urlTitle = page.title.replace(/\s/g, '_').replace(/\W/g, '');
    } else {
        page.urlTitle = Math.random().toString(36).substring(2, 7);
    }
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        allowNull: false
    }
});

//This adds methods to 'Page', such as '.setAuthor'. It also creates a foreign key attribute on the Page table pointing ot the User table
Page.belongsTo(User, {
    as: 'author'
});

module.exports = {
    db,
    Page,
    User
};