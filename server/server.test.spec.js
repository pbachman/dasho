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

  it('AccountCurrent_GetProfile_ShouldGet200', function method(done) {
    request(server)
      .get('/api/account/current')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('AccountCurrent_WithoutAuthorizedGetProfile_ShouldGet401', function method(done) {
    request(server)
      .get('/api/account/current')
      .set('Authorization', 'Bearer wrong')
      .expect(500, done);
  });

  it('Account_RequiredFieldsMissing_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/account/')
      .send({})
      .expect(400, 'Required fields missing!', done);
  });

  it('Account_UserAlreadyExists_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/account/')
      .send({ email: 'hi@dasho.co', password: 'test1234' })
      .expect(400, 'User already exists!', done);
  });

  it('InviteFriend_WithAlreadyExistUser_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/invite/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'hi@dasho.co', friend: 'hi@dasho.co' })
      .expect(400, 'User already exists!', done);
  });

  it('InviteFriend_RequiredFieldsMissing_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/invite/')
      .set('Authorization', 'Bearer ' + token)
      .expect(400, 'Required fields missing!', done);
  });

  it('PwdChange_RequiredFieldsMissing_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({})
      .expect(400, 'Required fields missing!', done);
  });

  it('PwdChange_WithWrongUser_ShouldFailWith401', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'wrong@user.com', password: 'wrong', newpassword: 'wrong', newpasswordconfirm: 'wrong' })
      .expect(401, done);
  });

  it('PwdChange_WithWrongPassword_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'hi@dasho.co', password: 'wrong', newpassword: 'wrong', newpasswordconfirm: 'wrong' })
      .expect(400, 'Password is wrong!', done);
  });

  it('PwdChange_NotEqualPassword_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/changepassword/')
      .set('Authorization', 'Bearer ' + token)
      .send({ username: 'hi@dasho.co', password: 'test1234', newpassword: '1234', newpasswordconfirm: '5678' })
      .expect(400, 'Password and Confirm Password are not equal!', done);
  });

  it('PwdReset_RequiredFieldsMissing_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/pwdreset')
      .send({})
      .expect(400, 'Required fields missing!', done);
  });

  it('PwdReset_WithAdminUser_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/pwdreset')
      .send({ username: 'hi@dasho.co' })
      .expect(400, 'Is not allowed to reset this E-mail address!', done);
  });

  it('PwdReset_WithWrongUser_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/pwdreset')
      .send({ username: 'wrong@user.com' })
      .expect(400, 'Unknown User!', done);
  });

  it('ChangeUserSettings_RequiredFieldsMissing_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/settings/hi@dasho.co')
      .set('Authorization', 'Bearer ' + token)
      .send({})
      .expect(400, 'Required fields missing!', done);
  });

  it('ChangeUserSettings_WithoutAccess_ShouldFailWith401', function method(done) {
    request(server)
      .put('/api/settings/wrong@user.com')
      .set('Authorization', 'Bearer ' + token)
      .send({ "setting": { "id": "6VCBtKRtdvC0iB4A", "tile": "clock", "baseUrl": "", "position": 1, "schemas": "clock { datetime totalSeconds }" } })
      .expect(401, 'Access denied!', done);
  });

  it('ChangeUserSettings_UserSettings_ShouldGet200', function method(done) {
    request(server)
      .put('/api/settings/hi@dasho.co')
      .set('Authorization', 'Bearer ' + token)
      .send({ "setting": { "id": "6VCBtKRtdvC0iB4A", "tile": "clock", "baseUrl": "", "position": 1, "schemas": "clock { datetime totalSeconds }" } })
      .expect(200, done);
  });

  it('AssignTileToUser_RequiredFieldsMissing_ShouldFailWith400', function method(done) {
    request(server)
      .post('/api/settings/hi@dasho.co')
      .set('Authorization', 'Bearer ' + token)
      .send({})
      .expect(400, 'Required fields missing!', done);
  });

  it('AssignTileToUser_WithoutAccess_ShouldFailWith401', function method(done) {
    request(server)
      .post('/api/settings/wrong@user.com')
      .set('Authorization', 'Bearer ' + token)
      .send({
        tile: 'clock'
      })
      .expect(401, done);
  });

  it('AssignTileToUser_AssignExistingTile_ShouldGet400', function method(done) {
    request(server)
      .post('/api/settings/hi@dasho.co')
      .set('Authorization', 'Bearer ' + token)
      .send({
        tile: 'clock'
      })
      .expect(400, 'clock already assigned', done);
  });

  it('DeletesUserSetting_AssignClockTileToExistingUser_ShouldGet200', function method(done) {
    request(server)
      .delete('/api/settings/hi@dasho.co/clock')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });

  it('DeletesUserSetting_WithoutAccess_ShouldFailWith401', function method(done) {
    request(server)
      .delete('/api/settings/wrong@user.com/clock')
      .set('Authorization', 'Bearer ' + token)
      .send()
      .expect(401, 'Access denied!', done);
  });

  it('UserSettings_WithWrongUser_ShouldFailWith401', function method(done) {
    request(server)
      .get('/api/settings/wrong@user.com')
      .set('Authorization', 'Bearer ' + token)
      .expect(401, 'Access denied!', done);
  });

  it('UserSettings_Settings_ShouldGet200', function method(done) {
    request(server)
      .get('/api/settings/hi@dasho.co')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('UnassignedSettings_WithoutAccess_ShouldGet401', function method(done) {
    request(server)
      .get('/api/settings/unassigned/wrong@user.com')
      .set('Authorization', 'Bearer ' + token)
      .expect(401, 'Access denied!', done);
  });

  it('UnassignedSettings_UnassignedSettingFromUser_ShouldGet200', function method(done) {
    request(server)
      .get('/api/settings/unassigned/hi@dasho.co')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('Tiles_AllTiles_ShouldGet200', function method(done) {
    request(server)
      .get('/api/tiles')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('UpdateTile_RequiredFieldsMissing_ShouldFailWith400', function method(done) {
    request(server)
      .put('/api/tiles/fixer')
      .set('Authorization', 'Bearer ' + token)
      .send({
        tile: ''
      })
      .expect(400, 'Required fields missing!', done);
  });

  it('UpdateTile_ValidTile_ShouldGet200', function method(done) {
    request(server)
      .put('/api/tiles/fixer')
      .set('Authorization', 'Bearer ' + token)
      .send({ "tile": { "_id": "tuAPdN68QwtG4Aha", "name": "fixer", "baseUrl": "http://data.fixer.io/api/latest", "apikey": "", "apisecret": "", "schema": "fixer { currency CHF USD EUR GBP }" } })
      .expect(200, done);
  });
});
