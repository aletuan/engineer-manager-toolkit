# Operation Guidelines

Tài liệu này tóm tắt các lệnh thường dùng trong quá trình phát triển dự án Engineer Manager Toolkit.

## Cài đặt và Khởi động

### Cài đặt dependencies

```bash
# Cài đặt dependencies cho toàn bộ dự án (cả frontend và backend)
pnpm install

# Cài đặt dependencies cho backend
cd server
pnpm install
```

### Khởi động ứng dụng

```bash
# Khởi động backend server
cd server
pnpm run dev

# Khởi động frontend (từ thư mục gốc)
pnpm run dev
```

## Prisma Commands

### Quản lý Schema và Database

```bash
# Generate Prisma Client sau khi thay đổi schema
cd server
pnpm prisma generate

# Tạo migration mới khi thay đổi schema
cd server
pnpm prisma migrate dev --name <tên_migration>

# Áp dụng migration vào database
cd server
pnpm prisma migrate deploy

# Reset database và áp dụng lại tất cả migrations
cd server
pnpm prisma migrate reset

# Push schema trực tiếp vào database (không tạo migration)
cd server
pnpm prisma db push

# Reset database và áp dụng schema (force)
cd server
pnpm prisma db push --force-reset

# Seed database với dữ liệu mẫu
cd server
pnpm prisma db seed
```

### Khám phá và Quản lý Dữ liệu

```bash
# Mở Prisma Studio để xem và chỉnh sửa dữ liệu
cd server
pnpm prisma studio
```

## Scripts Hữu ích

### Kiểm tra Lịch trực

```bash
# Kiểm tra lịch trực Standup Hosting
cd server
pnpm ts-node scripts/check-standup-hosting.ts

# Kiểm tra lịch trực Incident Rotation
cd server
pnpm ts-node scripts/check-incident-rotation.ts
```

## Quản lý Git

```bash
# Kiểm tra trạng thái hiện tại
git status

# Tạo branch mới
git checkout -b feature/<tên_feature>

# Commit thay đổi
git add .
git commit -m "feat: mô tả thay đổi"

# Push lên remote repository
git push origin <tên_branch>

# Pull code mới nhất từ remote
git pull origin <tên_branch>
```

## Testing

```bash
# Chạy unit tests
cd server
pnpm test

# Chạy tests với coverage
cd server
pnpm test:coverage
```

## Swagger API Documentation

Sau khi khởi động server, bạn có thể truy cập Swagger UI để xem và thử nghiệm API tại:

```
http://localhost:3001/api-docs
```

## Troubleshooting

### Lỗi Prisma Client không nhận diện model mới

Nếu gặp lỗi "Property 'modelName' does not exist on type 'PrismaClient'", hãy thực hiện:

```bash
cd server
pnpm prisma generate
```

### Lỗi Database không đồng bộ với Schema

```bash
cd server
pnpm prisma db push --force-reset
pnpm prisma db seed
```

### Lỗi Port đã được sử dụng

Nếu gặp lỗi "Port 3001 is already in use", hãy tìm và kill process đang sử dụng port:

```bash
# Tìm process sử dụng port
lsof -i :3001

# Kill process
kill -9 <PID>
```

## Quy trình Phát triển

1. Pull code mới nhất từ branch chính
2. Tạo branch mới cho feature/fix
3. Phát triển và test locally
4. Commit và push code
5. Tạo Pull Request
6. Review và merge sau khi được approve

## Lưu ý

- Luôn chạy `pnpm prisma generate` sau khi thay đổi schema
- Sử dụng conventional commits để dễ dàng theo dõi lịch sử thay đổi
- Đảm bảo tests pass trước khi tạo Pull Request
- Cập nhật documentation khi thêm tính năng mới 