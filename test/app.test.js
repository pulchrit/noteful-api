const app = require('../src/app');

describe("App", () => {
    it('GET / responds with status 200 containing "hello world"', () => {
        return request(app)
            .get('/')
            .expect(200, 'hey there, boilerplate');
    });
});