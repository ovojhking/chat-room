const acl = require('acl');
const aclAuth = new acl(new acl.memoryBackend());
// aclAuth.allow('admin', ['/api/users'], '*');
aclAuth.allow([
    {
        roles: 'admin',
        allows: [
            { resources: '/api/users', permissions: '*' }
        ]
    },
    {
        roles: 'member',
        allows: [
            { resources: '/api/users', permissions: 'get' }
        ]
    }
]);
// acl.allow('admin', 'user-management', '*');
// acl.addUserRoles('jimmy', 'admin');

// const addRoles = (req, res, next) => {
//     return aclAuth.addUserRoles(req.uuid, 'member',err=>{
//         console.log('------here:err', err);
//         next();
//     });
// }
const addRoles = (uuid, role) => {
    return aclAuth.addUserRoles(uuid, role, err=>{
        console.error('err', err);
    });
}

const middleware = (req, res, next) => {
    aclAuth.middleware(2,req.uuid)(req, res, next);
}

module.exports.addRoles = addRoles;
module.exports.middleware = middleware;
