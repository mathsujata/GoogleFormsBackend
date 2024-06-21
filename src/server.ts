import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();
const port = 3000;
const dbFilePath = './db.json';

app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
    res.send(true);
});

app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    let submissions = [];

    if (fs.existsSync(dbFilePath)) {
        submissions = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    }

    submissions.push(newSubmission);
    fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
    res.send({ success: true });
});

app.get('/read', (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);
    if (isNaN(index)) {
        return res.status(400).send({ error: 'Invalid index' });
    }

    if (fs.existsSync(dbFilePath)) {
        const submissions = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        if (index >= 0 && index < submissions.length) {
            return res.send(submissions[index]);
        }
    }
    res.status(404).send({ error: 'Submission not found' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
