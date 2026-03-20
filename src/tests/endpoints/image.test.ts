import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('Image Endpoints', () => {
    // Happy Path
    it('GET /images should resize a card and fetch it', async () => {
        const res = await request
            .get('/api/images?filename=fjord.jpg&width=200&height=200');

        expect(res.status).toBe(200);
    });

    it('GET /images should fail with unknown image name', async () => {
        const res = await request.get('/api/images');

        expect(res.status).toBe(400);
    });

    it('GET /images should fail with missing width/height', async () => {
        const resHeight = await request.get('/api/images?filename=fjord.jpg&height=200');

        expect(resHeight.status).toBe(400);

        const resWidth = await request.get('/api/images?filename=fjord.jpg&width=200');

        expect(resWidth.status).toBe(400);
    });

    it('GET /images should fail with invalid width/height', async () => {
        const resHeight = await request.get('/api/images?filename=fjord.jpg&width=*&height=200');

        expect(resHeight.status).toBe(400);

        const resWidth = await request.get('/api/images?filename=fjord.jpg&width=200&height=ff');

        expect(resWidth.status).toBe(400);
    });

    it('GET /images should create new thumbnail if not exists', async () => {
        const resHeight = await request.get('/api/images?filename=icelandwaterfall.jpg&width=200&height=200');

        expect(resHeight.status).toBe(200);
    });

    it('GET /images should create new thumbnail with alternate dimensions', async () => {
        const resHeight = await request.get('/api/images?filename=icelandwaterfall.jpg&width=400&height=200');

        expect(resHeight.status).toBe(200);
    });

    it('GET /images/all returns a collection of image names', async () => {
        const response = await request.get('/api/images/all');

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
});                       