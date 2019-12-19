const acl = require('acl');
const aclAuth = new acl(new acl.memoryBackend());
aclAuth.allow([
    {
        roles: 'admin',
        allows: [
            { resources: '/api/users', permissions: '*' },
            { resources: '/api/user', permissions: '*' }
        ]
    },
]);

const addRoles = (uuid, role) => {
    return aclAuth.addUserRoles(uuid, role, err=>{
        console.error('err', err);
    });
}

const middleware = (numPathComponents, req, res, next) => {
    aclAuth.middleware(numPathComponents,req.uuid)(req, res, next);
}

module.exports.addRoles = addRoles;
module.exports.middleware = middleware;