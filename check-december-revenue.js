const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Kết nối đến database
const dbPath = path.join(__dirname, 'src/database/Nhom16QLGO (1).sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('Lỗi kết nối database:', err.message);
        return;
    }
    console.log('Đã kết nối đến database');
});

// Truy vấn dữ liệu tháng 12/2025
const query = `
    SELECT 
        date(NgaySua) as date, 
        COUNT(*) as repairCount, 
        SUM(TongTien) as totalRevenue,
        GROUP_CONCAT(MaPhieuSuaChua) as repairIds
    FROM PHIEUSUACHUA 
    WHERE strftime('%m', NgaySua) = '12' 
    AND strftime('%Y', NgaySua) = '2025' 
    GROUP BY date 
    ORDER BY date`;

db.all(query, [], (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }

    console.log('\n=== BÁO CÁO DOANH THU THÁNG 12/2025 ===');
    console.log('======================================\n');
    
    if (rows.length === 0) {
        console.log('Không có dữ liệu sửa chữa nào trong tháng 12/2025');
        return;
    }

    let totalRevenue = 0;
    let totalRepairs = 0;

    rows.forEach(row => {
        totalRevenue += row.totalRevenue || 0;
        totalRepairs += row.repairCount || 0;
        
        console.log(`📅 Ngày: ${row.date}`);
        console.log(`   - Số phiếu sửa: ${row.repairCount}`);
        console.log(`   - Doanh thu: ${formatCurrency(row.totalRevenue || 0)}`);
        console.log(`   - Danh sách mã phiếu: ${row.repairIds || 'Không có'}`);
        console.log('   -----------------------------------');
    });

    console.log('\n=== TỔNG KẾT ===');
    console.log(`Tổng số phiếu sửa: ${totalRepairs}`);
    console.log(`Tổng doanh thu: ${formatCurrency(totalRevenue)}`);
    console.log('======================================\n');
});

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(amount);
}

// Đóng kết nối khi hoàn thành
process.on('exit', () => {
    db.close();
});
