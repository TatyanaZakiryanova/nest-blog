import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { Role } from 'src/users/role.enum';
import { Post } from 'src/posts/post.entity';
import { Comment } from 'src/comments/comment.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Post, Comment],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);

  const adminExists = await userRepo.findOne({
    where: { email: 'admin@example.com' },
  });

  if (adminExists) {
    console.log('Admin already exists');
    return;
  }

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

  const admin = userRepo.create({
    fullName: 'Admin',
    email: 'admin@example.com',
    password: passwordHash,
    role: Role.ADMIN,
    avatarUrl: null,
  });

  await userRepo.save(admin);
  console.log('Admin created');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error seeding admin:', err);
  process.exit(1);
});
