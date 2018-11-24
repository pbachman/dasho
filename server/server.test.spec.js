/**
 * Contains all Unit Tests for the Rest API.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

var request = require('supertest');

describe('Dash0 backend/middleware', function () {
  let server;
  let token;

  // TODO
  // fix all Unittests with oauthServer.authorise().
  before(function () {
    server = require('./index');
  });

  afterEach(function () {
    server.close();
  });

  it('InviteFriend_WithMissingUser_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/invite/')
      .set('Authorization', 'Bearer ' + token)
      .expect(400, done);
  });

  it('Login_WithMissingCredentials_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/login/')
      .expect(400, done);
  });

  it('Login_WithWrongCredentials_ShouldFailWith401', function method(done) {
    request(server)
      .post('/api/login/')
      .send({ username: 'hi@dasho.co', password: 'wrong' })
      .expect(401, done);
  });

  it('Login_WithCorrectCredentials_ShouldGet200', function method(done) {
    request(server)
      .post('/api/login/')
      .send({ username: 'hi@dasho.co', password: 'test1234' })
      .expect(200, done);
  });

  it('PwdReset_WithWrongUser_ShouldFailWith200', function method(done) {
    request(server)
      .post('/api/pwdreset')
      .send({ username: 'wrong@user.com' })
      .expect(200, done);
  });

  it('InviteFriend_WithMissingUser_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/invite/')
      .set('Authorization', 'Bearer ' + token)
      .expect(400, done);
  });

  it('InviteFriend_WithAlreadyExistUser_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/invite/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'hi@dasho.co', friend: 'hi@dasho.co' })
      .expect(400, done);
  });

  it('PwdChange_WithWrongUser_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'wrong@user.com', password: 'wrong', newpassword: 'wrong', newpasswordconfirm: 'wrong' })
      .expect(400, done);
  });

  it('PwdChange_WithWrongPassword_ShouldFailWith401', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'hi@dasho.co', password: 'wrong', newpassword: 'wrong', newpasswordconfirm: 'wrong' })
      .expect(401, done);
  });

  it('PwdChange_WithWrongNewPassword_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'hi@dasho.co', password: 'test1234', newpassword: '1234', newpasswordconfirm: '5678' })
      .expect(400, done);
  });

  it('UserSettings_WithWrongUser_ShouldFailWith400', function method(done) {
    request(server)
      .get('/api/settings/wrong@user.com')
      .set('Authorization', 'Bearer ' + token)
      .expect(400, done);
  });

  it('UserSettings_WithCorrectUser_ShouldGet200', function method(done) {
    request(server)
      .get('/api/settings/hi@dasho.co')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
