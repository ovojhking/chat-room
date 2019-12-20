const supertest = require('supertest');
let apiRouter = require('../routes/api');
const express = require('express');
const app = express();
const db = require('../models/index');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRouter);

afterAll(done => {
	db.sequelize.close();
	done();
});

describe('api basic test', () => {
    it('it should return a 200 response', async done => {
        let api = supertest(app);
        api.post('/api/login')
            .send({name: 'jimmy', password: '0000'})
            .expect(200)
            .end((err, res) => {
				expect(res.body.success).toBe(true);
				expect(err).toBe(null);
                done();
            });
    }); 
});