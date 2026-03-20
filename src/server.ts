import express, { Request, Response } from 'express';
import { getImage, imageExists, getAvailableImages } from './features/images';

const app = express();
const PORT = 3000;

app.get('/', (_req: Request, res: Response): void => {
    res.send('Image Processing API - Use /api/images?filename=name&width=200&height=200');
});

app.get('/api/images', async (req: Request, res: Response): Promise<void> => {
    // Claude AI helped by recommending a lot of boundary checking before the core api call.
    const { filename, width, height } = req.query;

    if (!filename) {
        res.status(400).json({ error: 'Missing filename parameter' });
        return;
    }

    if (!width || !height) {
        res.status(400).json({ error: 'Missing width or height parameters' });
        return;
    }

    const widthNum = Number(width);
    const heightNum = Number(height);

    if (!Number.isInteger(widthNum) || !Number.isInteger(heightNum)) {
        res.status(400).json({ error: 'Width and height must be valid integers' });
        return;
    }

    if (widthNum <= 0 || heightNum <= 0) {
        res.status(400).json({ error: 'Width and height must be positive numbers' });
        return;
    }

    const filenameStr = filename as string;
    const exists = await imageExists(filenameStr);

    if (!exists) {
        const available = await getAvailableImages();
        res.status(404).json({
            error: `Image '${filenameStr}' not found`,
            availableImages: available
        });
        return;
    }

    try {
        const image = await getImage(filenameStr, widthNum, heightNum);
        res.set('Content-Type', 'image/jpeg');
        res.send(image);
    } catch (err) {
        console.error('Error processing image:', err);
        res.status(500).json({ error: 'Error processing image' });
    }
});

app.get('/api/images/all', async (_req: Request, res: Response): Promise<void> => {
    // Claude AI helped by recommending a lot of boundary checking before the core api call.
    try {
        const available = await getAvailableImages();
        res.send(available);
    } catch (err) {
        console.error('Error fetching images:', err);
        res.status(404).json({
            error: `Images not found`,
        });
    }
});

app.listen(PORT, (): void => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
