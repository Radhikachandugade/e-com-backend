import colors from 'colors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

connectDB();

const app = express();
app.use(express.json()); // Parsing http request body

const corsOptions = {
  origin: 'https://e-com-frontend-one.vercel.app/',
  credentials: true // if you're using cookies or sessions
};

app.use(cors(corsOptions));

app.options('/test-cors', cors(corsOptions), (req, res) => {
  res.status(200).send('CORS enabled');
});

app.get('/test-cors', cors(corsOptions), (req, res) => {
  res.status(200).send('CORS enabled');
});


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

//paypal client ID Router
// app.get("/api/config/paypal", (req, res) => {
// 	res.send(process.env.PAYPAL_CLIENT_ID);
// });

// Create a static folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/build')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	});
} else {
	app.get('/', (req, res) => {
		res.send('Api is running...');
	});
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
});
