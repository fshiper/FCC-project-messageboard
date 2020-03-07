/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const Thread = require("../models/thread");

module.exports = function(app) {
  app
    .route("/api/threads/:board")

    .post((req, res) => {
      const pathBoard = req.params.board
      const {
        board: board,
        text: text,
        delete_password: delete_password
      } = req.body;
      const newThread = new Thread({
        board: board,
        text: text,
        delete_password: delete_password
      });
      newThread.save((err, thread) => {
        if (err) return res.status(400).json(err);
        res.status(200).redirect(`/b/${pathBoard}`);
      });
    })

    .put((req, res) => {
      const thread_id = req.query.thread_id
      const qry = {
        _id: thread_id
      }
      const reportThread = {
        reported: true
      }
      Thread.updateOne(qry, reportThread, (err, thread)=> {
        if (err) res.status(400).json(err)
        res.status(200).send('success')
      })
    })
  
    .delete((req, res) => {
      const { thread_id, delete_password } = req.body;
      Thread.findById(thread_id, (err, thread) => {
        if (err) return res.status(400).json(err)
        //in case thread was already deleted let's pretend we deleted it again (for testing)
        if (!thread) return res.status(200).send('success')
        if (thread.delete_password !== delete_password) {
          res.send("incorrect password")
        } else {
          Thread.findByIdAndDelete(thread_id, (err, deleted) => {
            if (err) return res.status(400).json(err)            
            res.status(200).send("success")
          })
        }
      })
    })

    .get((req, res) => {
      const board = req.params.board
    
      Thread.aggregate([
        {
          $project: {
            _id: 1,
            text: 1,
            created_on: 1,
            bumped_on: 1,
            board: 1,
            replies: {
              $slice: ["$replies", -3]
            },
            replycount: {
              $cond: {
                if: { $isArray: "$replies" },
                then: { $size: "$replies" },
                else: "NA"
              }
            }
          }
        }
      ]).match({board: board})
        .project(" -replies.reported -replies.delete_password -board")
        .sort("-bumped_on")
        .limit(10)
        .exec((err, threadList) => {
          if (err) return res.status(400).json(err);
          res.status(200).json(threadList);
        });
    });

  app
    .route("/api/replies/:board")

    .post((req, res) => {
      const {
        thread_id: thread_id,
        text: text,
        delete_password: delete_password
      } = req.body;
      Thread.findById(thread_id, (err, thread) => {
        if (err) return res.status(400).json(err);
        if (!thread) return res.send("Thread not found");
        let reply = {
          text: text,
          delete_password: delete_password
        };
        thread.replies.push(reply);
        thread.bumped_on = new Date();
        thread.save((err, updatedThread) => {
          if (err) return res.status(400).json(err);
          res.status(200).redirect(`/b/${thread.board}/${thread._id}`);
        });
      });
    })

    .put((req, res) => {
      const {thread_id, reply_id} = req.query
      const qry = {
        _id: thread_id,
        "replies._id": reply_id
      }
      const reportReply = {
        "$set": {
          "replies.$.reported": true
        }
      }
      Thread.updateOne(qry, reportReply, (err, savedReply) => {
        if (err) return res.status(400).json(err)
        res.status(200).send("success")
      })
    })
  
    .delete((req, res) => {
      const{ thread_id, reply_id, delete_password } = req.body
      const qry = {
        _id: thread_id,
        "replies._id":reply_id
      }
      Thread.findOne(qry, {'replies.$':1},(err, threadReply) => {
        if (err || !threadReply) return res.status(400).json(err)
        if (threadReply.replies[0].delete_password !== delete_password) {
          res.send("incorrect password")
        } else {
          const setDeleted = {
            "$set": {
              "replies.$.text": '[deleted]'
            }
          }
          Thread.updateOne(qry, setDeleted, (err, savedReply) => {
            if (err) return res.status(400).json(err)
            res.status(200).send("success")
          })
        }
      })
    })
  
    .get((req, res) => {
      const thread_id = req.query.thread_id;
      const board = req.params.board
      const qry = {
        _id: thread_id,
        board: board
      }
      Thread.findOne(qry)
        .select(
          `
          -reported 
          -delete_password 
          -replies.reported 
          -replies.delete_password
        `
        )
        .exec((err, threadList) => {
          if (err) return res.status(400).json(err);
          res.status(200).json(threadList);
        });
    });
};
