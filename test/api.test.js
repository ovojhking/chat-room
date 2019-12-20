const sinon = require('sinon');
const supertest = require('supertest');
const db = require('../models/index');
const jwtAuth = require('../auths/jwtAuth');
const aclAuth = require('../auths/aclAuth');
let jwtStub = null;
let aclStub = null;
let app = null;
let api = null;

beforeEach(function() {
	jwtStub = sinon.stub(jwtAuth, 'auth')
		.callsFake(function(req, res, next) {
			return next();
		});  
	aclStub = sinon.stub(aclAuth, 'middleware')
		.callsFake(function(numPathComponents, req, res, next) {
			return next();
		});

	const express = require('express');
	app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	const apiRouter = require('../routes/api');
	app.use('/api', apiRouter);
	api = supertest(app);
});

afterEach(() => {
	jwtStub.restore();
	aclStub.restore();
});

afterAll(done => {
	db.sequelize.close();
	done();
});

describe('api/login', () => {
    it('it should return a 200 response', async done => {
        api.post('/api/login')
            .send({name: 'jimmy', password: '0000'})
            .expect(200)
            .end((err, res) => {
				expect(res.body.success).toBe(true);
				expect(err).toBe(null);
                done();
            });
	}); 
	it('wrong password should return success: false', async done => {
        api.post('/api/login')
            .send({name: 'jimmy', password: '0011'})
            .expect(200)
            .end((err, res) => {
				expect(res.body.success).toBe(false);
				expect(err).toBe(null);
                done();
            });
	}); 
	it('user not found should return success: false', async done => {
        api.post('/api/login')
            .send({name: 'jyyy', password: '0011'})
            .expect(200)
            .end((err, res) => {
				expect(res.body.success).toBe(false);
				expect(err).toBe(null);
                done();
            });
	}); 
});

describe('api/users', () => {
    it('GET should return users', async done => {
        api.get('/api/users')
            .expect(200)
            .end((err, res) => {
				expect(res.body.success).toBe(true);
				const {users} = res.body;

				expect(typeof users).toBe('object');
				users.forEach(user=>{
					expect(Object.keys(user)).toHaveLength(2);
					expect(user).toHaveProperty('name');
					expect(user).toHaveProperty('id');
				});
				expect(err).toBe(null);
                done();
            });
    }); 
});