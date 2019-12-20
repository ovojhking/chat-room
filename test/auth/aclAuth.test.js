const sinon = require('sinon');
let aclAuth = null;
let addUserRoles = null;
let middleware = null;

beforeEach(function() {
    const acl = require('acl');
    addUserRoles = sinon.stub(acl.prototype, 'addUserRoles');
    middleware = sinon.stub(acl.prototype, 'middleware')
        .callsFake((numPathComponents, uuid) => {
            return (req, res, next)=>{}
        });
        aclAuth = require('../../auths/aclAuth');
});

afterEach(() => {
    addUserRoles.restore();
    middleware.restore();
});

describe('addRoles', () => {
    it('addRoles should call acl.addUserRoles method', async done => {
        const uuid = '1';
        const role = '2';
        aclAuth.addRoles(uuid,role);
        expect(addUserRoles.calledOnce).toBe(true);
        expect(addUserRoles.calledWith(uuid,role)).toBe(true);
        done();
	}); 
});
describe('middleware', () => {
    it('middleware should call acl.middleware method', async done => {
        const numPathComponents = '1';
        const req = {uuid: '2'};
        const res = '3';
        const next = '4';

        aclAuth.middleware(numPathComponents, req, res, next);
        expect(middleware.calledOnce).toBe(true);
        expect(middleware.calledWith(numPathComponents,req.uuid)).toBe(true);
        done();
	}); 
});
