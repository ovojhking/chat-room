const sinon = require('sinon');
let jwtAuth = null;
let jwtStub = null;

beforeEach(function() {
    const jwt = require('jsonwebtoken');
	jwtStub = sinon.stub(jwt, 'verify');
    jwtAuth = require('../../auths/jwtAuth');
});

afterEach(() => {
	jwtStub.restore();
});

describe('addRoles', () => {
    it('it should be green', async done => {
        const req = {headers: {authorization: 'a b'}};
        const bearerToken = req.headers.authorization.split(' ')[1];
        const res = '1';
        const next = '2';
        jwtAuth.auth(req, res, next);
        expect(jwtStub.calledOnce).toBe(true);
        expect(jwtStub.calledWith(bearerToken, jwtAuth.key)).toBe(true);
        done();
	}); 
});
