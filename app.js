import express from 'express';
import path from 'path';
import router from './src/routes/index.js';
import { PrismaClient } from '@prisma/client';

const app = express();
const __dirname = import.meta.dirname;

// Init middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Init routes
app.use('', router);

// Init database
export const prisma = new PrismaClient();

// Use static files
app.use(express.static(path.join(__dirname, 'public')));

// Server setup
const PORT = process.env.PORT ?? 1111;

const server = app.listen(PORT, () => {
    console.log(`TechKit starts at port http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit Server Express');
        prisma.$disconnect;
    });
});

const products = await prisma.product.createMany({
    data: [
        {
            name: 'Laptop Acer Swift X SFX16 51G 516Q',
            price: 29990000,
            brand: 'Acer',
            description:
                'Bên cạnh Acer Aspire 5 dòng laptop văn phòng mỏng nhẹ dành cho các bạn học sinh - sinh viên thì Acer còn mang đến thị trường ở phân khúc cao cấp hơn với mẫu laptop Acer  Swift X dòng laptop mỏng nhẹ, cao cấp với hiệu năng có thể xử lý mọi tác vụ như render, thiết kế đồ họa,....',
            category_id: 1,
            cpu: 'Intel Core i5',
            price_sale: 19990000,
            is_featured: true,
        },
        {
            name: 'Laptop Acer Swift 14 AI SF14 51 75VP',
            price: 39990000,
            brand: 'Acer',
            description:
                'Acer Swift 14 AI SF14 51 75VP là một trong những chiếc laptop cao cấp nhất của Acer, được thiết kế dành cho những người dùng đòi hỏi sự hoàn hảo về cả hiệu năng và thiết kế. Với cấu hình mạnh mẽ, màn hình OLED chất lượng cao và các tính năng thông minh, chiếc laptop này hứa hẹn sẽ mang đến những trải nghiệm tuyệt vời cho người dùng. Cùng GEARVN tìm hiểu thêm về sản phẩm trong phầm dưới đây để rõ hơn.',
            category_id: 1,
            cpu: 'Intel Core Ultra 7',
            price_sale: 38990000,
            is_featured: true
        },
    ],
});

// Handing errors

export default app;
