/**
 * Contains all Unit Tests for the Rest API.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */

var request = require('supertest');

describe('Dash0 backend/middleware', function () {
  let server;
  let token;

  before(function (done) {
    server = require('./index');

    request(server)
      .post('/oauth/token')
      .send({
        grant_type: 'password',
        client_id: 'dasho',
        client_secret: '$ecret',
        username: 'hi@dasho.co',
        password: 'test1234'
      })
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        token = res.body.access_token;
        done();
      });
  });

  afterEach(function () {
    server.close();
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

  it('AccountCurrent_GetProfile_ShouldGet200', function method(done) {
    request(server)
      .get('/api/account/current')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });

  it('AccountCurrent_WithoutAuthorizedGetProfile_ShouldGet401', function method(done) {
    request(server)
      .get('/api/account/current')
      .expect(500, done);
  });

  it('Account_AlreadyExists_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/account/')
      .send({ email: 'hi@dasho.co', password: 'test1234' })
      .expect(400, done);
  });

  it('InviteFriend_WithAlreadyExistUser_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/invite/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'hi@dasho.co', friend: 'hi@dasho.co' })
      .expect(400, done);
  });

  it('InviteFriend_RequiredFieldsMissing_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/invite/')
      .set('Authorization', 'Bearer ' + token)
      .expect(400, done);
  });

  it('PwdChange_WithWrongUser_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'wrong@user.com', password: 'wrong', newpassword: 'wrong', newpasswordconfirm: 'wrong' })
      .expect(400, done);
  });

  it('PwdChange_WithWrongPassword_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'hi@dasho.co', password: 'wrong', newpassword: 'wrong', newpasswordconfirm: 'wrong' })
      .expect(400, done);
  });

  it('PwdChange_WithWrongNewPassword_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'hi@dasho.co', password: 'test1234', newpassword: '1234', newpasswordconfirm: '5678' })
      .expect(400, done);
  });

  it('PwdReset_WithWrongUser_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/pwdreset')
      .send({ username: 'wrong@user.com' })
      .expect(400, done);
  });

  it('ChangeUserSettings_WithWrongUser_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/settings/wrong@user.com')
      .set('Authorization', 'Bearer ' + token)
      .expect(400, done);
  });

  it('AssignTitleToUser_WithWrongUser_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/settings/wrong@user.com/clock')
      .set('Authorization', 'Bearer ' + token)
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

  it('UserSettings_WithWrongUser_ShouldGet400', function method(done) {
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

  it('UserUnassignedSettings_WithWrongUser_ShouldGet400', function method(done) {
    request(server)
      .get('/api/settings/unassigned/wrong@user.com')
      .set('Authorization', 'Bearer ' + token)
      .expect(400, done);
  });

  it('UserUnassignedSettings_WithCorrectUser_ShouldGet200', function method(done) {
    request(server)
      .get('/api/settings/unassigned/hi@dasho.co')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
