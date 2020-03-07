/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    // suite("POST", function() {
    //   test("Test POST /api/threads/:board", function(done) {
    //     const board = "Functional tests";
    //     chai
    //       .request(server)
    //       .post(`/api/threads/${board}`)
    //       .send({
    //         board: board,
    //         text: "POST functional test for Threads",
    //         delete_password: "password"
    //       })
    //       .end((err, res) => {
    //         expect(res).to.redirect;
    //         expect(res).to.redirectTo(`/b/${board}`);
    //         done();
    //       });
    //   });
    // });

    suite("GET", function() {
      test("Test GET /api/threads/:board", function(done) {
        const board = "Functional tests";
        chai
          .request(server)
          .get(`/api/threads/${board}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(
              res.type,
              "application/json",
              "Response should be json"
            );
            assert.isArray(res.body, "res.body.replies should be an array");
            assert.isDefined(res.body[0]._id, "res.body._id should be defined");
            assert.isDefined(res.body[0].created_on,"res.body.created_on should be defined");
            assert.isDefined(res.body[0].bumped_on,"res.body.bumped_on should be defined");
            assert.isDefined(res.body[0].text,"res.body.text should be defined");
            assert.isAtLeast(res.body[0].replycount,0,"res.body.replycount should be at least 0");
            assert.isArray(res.body[0].replies,"res.body.replies should be an array");
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("Test DELETE /api/threads/:board => when password is CORRECT", function(done) {
        const board = "Functional tests";
        chai
          .request(server)
          .delete(`/api/threads/${board}`)
          .send({
            thread_id: "5e639a174d3eb906e24bbb25",
            delete_password: "test"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html", "Response should be text");
            assert.equal(res.text, "success", "Delete should be successfull");
            done();
          });
      });

      test("Test DELETE /api/threads/:board => when password is INCORRECT", function(done) {
        const board = "Functional tests";
        chai
          .request(server)
          .delete(`/api/threads/${board}`)
          .send({
            thread_id: "5e620b273155f64ace17f0d5",
            delete_password: "test123123"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html", "Response should be text");
            assert.equal(
              res.text,
              "incorrect password",
              "'incorrect password' should be returned"
            );
            done();
          });
      });
    });

    suite("PUT", function() {
      test("Test PUT /api/threads/:board => reporting a thread", function(done) {
        const board = "Functional tests";
        chai
          .request(server)
          .put(`/api/threads/${board}`)
          .query({
            thread_id: "5e620b273155f64ace17f0d5"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html", "Response should be text");
            assert.equal(res.text, "success", "Report should be successfull");
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    // suite("POST", function() {
    //   test("Test POST /api/replies/:board", function(done) {
    //     const board = "Functional tests";
    //     const thread = '5e63a0e761118925a0042555'
    //     chai
    //       .request(server)
    //       .post(`/api/replies/${board}`)
    //       .send({
    //         thread_id: thread,
    //         text: "POST functional test for replies",
    //         delete_password: "password"
    //       })
    //       .end((err, res) => {
    //         expect(res).to.redirect;
    //         expect(res).to.redirectTo(`/b/${board}/${thread}`);
    //         done();
    //       });
    //   });  
    // });

    suite("GET", function() {});
      test("Test GET /api/replies/:board/:thread_id", function(done) {
        const board = "general";
        const thread_id = '5e6246c068ddf10bbc4ffb5f'
        chai
          .request(server)
          .get(`/api/replies/${board}`)
          .query({
            thread_id: thread_id
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type,"application/json","Response should be json");
            assert.equal(res.body._id,thread_id, "res.body._id should be equal '5e6246c068ddf10bbc4ffb5f'");
            assert.isDefined(res.body.created_on,"res.body.created_on should be defined");
            assert.isDefined(res.body.bumped_on,"res.body.bumped_on should be defined");
            assert.equal(res.body.text,'New General Thread 14',"res.body.text should be New General Thread 14");
            assert.isArray(res.body.replies,"res.body.text should be defined");
            done();
          });
      });
    
    suite("PUT", function() {
      test("Test PUT /api/replies/:board => reporting a thread", function(done) {
        const board = "Functional tests";
        chai
          .request(server)
          .put(`/api/replies/${board}`)
          .query({
            thread_id: "5e63a0e761118925a0042555",
            reply_id: "5e63a7c88aa0d0574d1454cf"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html", "Response should be text");
            assert.equal(res.text, "success", "Report should be successfull");
            done();
          });
      });
    });
      
    suite("DELETE", function() {
      test("Test DELETE /api/replies/:board => when password is INCORRECT", function(done) {
        const board = "general";
        chai
          .request(server)
          .delete(`/api/replies/${board}`)
          .send({
            thread_id: "5e6204dc82507335b2698f48",
            reply_id: "5e63651de81059009584c95c",
            delete_password: "test123123"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html", "Response should be text");
            assert.equal(res.text,"incorrect password","'incorrect password' should be returned");
            done();
          });
      });   
      test("Test DELETE /api/replies/:board => when password is CORRECT", function(done) {
        const board = "general";
        chai
          .request(server)
          .delete(`/api/replies/${board}`)
          .send({
            thread_id: "5e6204dc82507335b2698f48",
            reply_id: "5e63651de81059009584c95c",
            delete_password: "test"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html", "Response should be text");
            assert.equal(res.text,"success","'success' should be returned");
            done();
          });
      }); 
    });
  });
});
