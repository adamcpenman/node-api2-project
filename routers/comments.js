const express = require('express')
const db = require('../data/db.js')

const router = express.Router({
    mergeParams: true
})

router.get("/", (req, res) => {
	db.findPostComments(req.params.id)
		.then(data => {
			res.json(data)
		})
		.catch(err => {
			res.status(500).json({
				message: "Could not get post messages",
			})
		})
})

router.get('/:commentId', (req, res) => {
    db.findCommentById(req.params.id, req.params.commentId)
      .then(comments => {
        if (comments) {
          res.status(200).json(comments);
        } else {
          res.status(404).json({
            message: 'The specified ID does not exist.'
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: 'Information can not be found.'
        });
      });
  });

router.post('/', (req, res) => {
    // const id = req.params.id;
    // const text = req.body.text;
    const commentInfo = {...req.body, post_id: req.params.id};
  
    if (!req.body.text) {
      res.status(400).json({
        errorMessage: 'Provide some words for the comment'
      });
    } else {
      db.insertComment(commentInfo)
        .then(post => {
          if (post) {
            res.status(201).json(post);
          } else {
            res.status(404).json({
              message: 'The specified ID does not exist.'
            });
          }
        })
        .catch(err => {
          res.status(500).json({
            error: 'Error while saving the comment to the database.'
          });
        });
    }
  });
  

  
  module.exports = router