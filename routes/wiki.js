const express = require("express");
const router = express.Router();
const models = require("../models");
const Page = models.Page;
const User = models.User;
const { main, addPage, editPage, wikiPage } = require("../views");

// /wiki
router.get("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) {
    next(error);
  }
});

// /wiki
router.post("/", async (req, res, next) => {
  try {
    const [user, createdPageBool] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });

    const page = await Page.create(req.body);

    page.setUser(user);

    res.redirect("/wiki/" + page.urlTitle);
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const pages = await Page.findAll({
      where: {
        tags: {
          $contains: [req.query.search]
        }
      }
    });

    res.send(main(pages));
  } catch (error) {
    next(error);
  }
});

router.post("/:urlTitle", async (req, res, next) => {
  try {
    const [updatedRowCount, updatedPages] = await Page.update(req.body, {
      where: {
        urlTitle: req.params.urlTitle
      },
      returning: true
    });

    res.redirect("/wiki/" + updatedPages[0].urlTitle);
  } catch (error) {
    next(error);
  }
});

router.get("/:urlTitle/delete", async (req, res, next) => {
  try {
    await Page.destroy({
      where: {
        urlTitle: req.params.urlTitle
      }
    });

    res.redirect("/wiki");
  } catch (error) {
    next(error);
  }
});

// /wiki/add
router.get("/add", (req, res) => {
  res.send(addPage());
});

// /wiki/(dynamic value)
router.get("/:urlTitle", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        urlTitle: req.params.urlTitle
      },
      include: [{ model: User }]
    });
    if (page === null) {
      throw generateError("No page found with this title", 404);
    } else {
      res.send(wikiPage(page));
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:urlTitle/edit", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        urlTitle: req.params.urlTitle
      },
      include: [{ model: User }]
    });

    if (page === null) {
      //to show you sendStatus in contrast to using the error handling middleware above
      res.sendStatus(404);
    } else {
      res.send(editPage(page));
    }
  } catch (error) {
    next(error);
  }
});

// /wiki/(dynamic value)
router.get("/:urlTitle/similar", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        urlTitle: req.params.urlTitle
      }
    });

    if (page === null) {
      throw generateError("No pages correspond to this title", 404);
    } else {
      const similar = await Page.findAll({
        where: {
          id: { $ne: page.id },
          tags: { $overlap: page.tags }
        }
      });

      res.send(main(similar));
    }
  } catch (error) {
    next(error);
  }
});

const generateError = (message, status) => {
  let err = new Error(message);
  err.status = status;
  return err;
};

module.exports = router;
