import express, { Application } from 'express';

const app: Application = express();
const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;