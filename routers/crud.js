const express = require('express');
const commentRouter = require('./comments.js')
const db = require('../data/db.js')

const router = express.Router()

router.use('/:id/comments', commentRouter)


router.get('/', (req, res) => {
    const opts = {
        limit: req.query.limit,
        sortby: req.query.sortby,
        sortdir: req.query.sortdir,
      }

    db.find(opts)
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(err => {
        res.status(500).json({
          error: 'The posts information could not be retrieved.'
        });
      });
  });

  router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(posts => {
        res
            .status(200)
            .json(posts)
    })
    .catch(() => {
        res
            .status(404)
            .json({ error: "Can not find that particular ID"})
    })
})

router.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: 'Provide title and contents for the post.'
    });
  } else {
    db.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        res.status(500).json({
          error: 'Error while saving'
        });
      });
  }
});

router.put('/:id', (req, res) => {
    if (!req.body.title || req.body.contents) {
        return res.status(400).json({ message: "Missing title" })
    }
    db.update(req.params.id, req.body) 
        .then(change => {
            if(change) {
                res.status(200).json(change)
            } else {
                res.status(404).json({ message: "Nothing can be found"})
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Error updating"
            })
        })
})


router.delete('/:id', (req, res) => { 
    db.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "BYE FOREVER"})
            } else {
                res.status(204).json({ message: "I dont know her"
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Error, WTF?!"
            })
        })
})

module.exports = router;