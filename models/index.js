const Sequelize = require("sequelize");

const db = new Sequelize("postgres://localhost:5432/wikistack", {
  logging: false
});

const Page = db.define("page", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    //since we are searching, editing, deleting by slug, these need to be unique
    unique: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM("open", "closed")
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  }
});

Page.beforeValidate(page => {
  /*
   * Generate slug
   */
  if (!page.slug) {
    page.slug = page.title.replace(/\s/g, "_").replace(/\W/g, "").toLowerCase();
  }

  if (typeof page.tags === "string") {
    page.tags = page.tags.split(",").map(str => str.trim());
  }
 
});

const User = db.define("user", {
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
Page.belongsTo(User, {as: 'author'});

Page.findByTag = async function(tag) {
  // 'this' refers directly back to the model (the capital "P" Page)
  const Op = Sequelize.Op;
  const pages = await Page.findAll({ 
    where: {
      tags: {
        [Op.overlap]: [tag]
      } // find all Pages where the specified tag is in the tags array.
    }
  })  
  return pages
}
Page.prototype.findSimilar = async function() {
  //the page we're comparing to is `this`, so no arguments needed
  const Op = Sequelize.Op;
  const pages = await Page.findAll({
    where: {
      tags: {
        [Op.overlap]: [...this.tags]
      }, // find all Pages where the current page's tags are in the tags array
      id: {
        [Op.ne]: this.id
      }
    }
  })
  return pages
}
module.exports = {
  db,
  Page,
  User
};
