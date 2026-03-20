import {
    resizeImage,
    getAvailableImages,
    processAndCacheImage,
    getImage,
    IMAGES_DIR,
    imageExists
} from '../../features/images';

describe('Image Unit Tests', () => {
    it('GET /images should resize a card and fetch it', async () => {
        const inputPath = `${IMAGES_DIR}/fjord.jpg`
        const buffer = await resizeImage(inputPath, 100, 100);
        
        expect(Buffer.isBuffer(buffer)).toBeTrue();
    });

    it('GET /images should fail with unknown image name', async () => {
        const invalidPath = `${IMAGES_DIR}/mywackyimage.jpg`;                         
        await expectAsync(resizeImage(invalidPath, 200, 200)).toBeRejectedWithError(/ENOENT/); 
    });

    it('GET /images that are available', async () => {
        const files = await getAvailableImages();
        
        expect(files.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /images exists', async () => {
        const exists = await imageExists('fjord.jpg');
        
        expect(exists).toBeTrue();
    });
    
    it('GET /images that are cached', async () => {
        const inputPath1 = `${IMAGES_DIR}/fjord.jpg`
        const buffer1 = await resizeImage(inputPath1, 100, 100);
        
        expect(Buffer.isBuffer(buffer1)).toBeTrue();
        const inputPath = `${IMAGES_DIR}/fjord.jpg`
        const buffer = await resizeImage(inputPath, 100, 100);
        
        expect(Buffer.isBuffer(buffer)).toBeTrue();
    });

    it('GET /images that are processed then cached', async () => {
        const buffer = await processAndCacheImage('fjord.jpg', 100, 100);
        
        expect(Buffer.isBuffer(buffer)).toBeTrue();
    });

    it('GET /images returns an image if its cached or processes and caches it', async () => {
        const buffer = await getImage('fjord.jpg', 100, 100);
        
        expect(Buffer.isBuffer(buffer)).toBeTrue();
    });

    it('GET /images/all returns a collection of image names', async () => {
        const collection = await getAvailableImages();
        
        expect(collection.length).toBeGreaterThanOrEqual(1);
    });
});                       