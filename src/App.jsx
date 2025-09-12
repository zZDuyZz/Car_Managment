function App() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #3b82f6, #2563eb)" // nền gradient xanh
    }}>
      <div style={{
        width: "400px",
        padding: "32px",
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        transition: "transform 0.3s ease-in-out"
      }}>
        {/* Logo + Tiêu đề */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img src="https://i.ibb.co/9g3qszn/car-logo.png" alt="Logo Gara"
               style={{ width: "70px", margin: "0 auto 12px" }} />
          <h1 style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#1e3a8a"
          }}>
            🚗 Chào mừng trở lại!
          </h1>
        </div>

        {/* Form */}
        <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input type="text" placeholder="Tên người dùng"
                 style={{
                   padding: "12px",
                   border: "1px solid #d1d5db",
                   borderRadius: "10px",
                   outline: "none",
                   transition: "0.3s",
                 }}
                 onFocus={(e) => e.target.style.border = "1px solid #2563eb"}
                 onBlur={(e) => e.target.style.border = "1px solid #d1d5db"}
          />

          <input type="password" placeholder="Mật khẩu"
                 style={{
                   padding: "12px",
                   border: "1px solid #d1d5db",
                   borderRadius: "10px",
                   outline: "none",
                   transition: "0.3s",
                 }}
                 onFocus={(e) => e.target.style.border = "1px solid #2563eb"}
                 onBlur={(e) => e.target.style.border = "1px solid #d1d5db"}
          />

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#374151"
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input type="checkbox" /> Ghi nhớ đăng nhập
            </label>
            <a href="#" style={{ color: "#2563eb", textDecoration: "none" }}>
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit"
                  style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "0.3s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
