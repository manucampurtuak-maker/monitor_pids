<?php
session_start();

 $host = "localhost";
 $user = "root";
 $pass = "";
 $db   = "db_antrian";
 $conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

if (isset($_POST['login'])) {
    $nik = $_POST['nik'];
    $password = $_POST['password'];

    $query = mysqli_query($conn, "SELECT * FROM karyawan WHERE nik='$nik'");
    $data = mysqli_fetch_assoc($query);

    if ($data && $data['password'] === $password && $data['role'] === 'admin') {
        $_SESSION['karyawan'] = [
            'nik'  => $data['nik'],
            'nama' => $data['nama'],
            'role' => $data['role']
        ];

        header("Location: control.php");
        exit();
    } else {
        $error = "NIK atau password salah / bukan admin!";
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - Sistem Antrian</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f2f5;
    position: relative;
    overflow: hidden;
}

body::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
    top: -150px;
    right: -100px;
    border-radius: 50%;
}

body::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(14, 122, 110, 0.05) 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
    border-radius: 50%;
}

.login-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 400px;
    padding: 20px;
}

.login-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 40px 32px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.login-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
}

.login-icon i {
    font-size: 22px;
    color: white;
}

.login-card h2 {
    text-align: center;
    color: #1a1d23;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
}

.login-card .subtitle {
    text-align: center;
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 32px;
}

.error-box {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.error-box i {
    font-size: 16px;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    color: #374151;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.input-wrap {
    position: relative;
}

.input-wrap i {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    font-size: 14px;
}

.input-wrap input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    color: #1a1d23;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
}

.input-wrap input::placeholder {
    color: #9ca3af;
}

.input-wrap input:focus {
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-login {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 6px;
}

.btn-login:hover {
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
}

.btn-login:active {
    transform: translateY(0);
}

.login-footer {
    text-align: center;
    margin-top: 28px;
    color: #9ca3af;
    font-size: 11px;
}

.login-footer i {
    margin-right: 4px;
}

@media (max-width: 480px) {
    .login-card {
        padding: 32px 20px;
    }
}
    </style>
</head>
<body>

    <div class="login-container">
        <div class="login-card">

            <div class="login-icon">
                <i class="fas fa-shield-alt"></i>
            </div>

            <h2>Login Admin</h2>
            <p class="subtitle">Masukkan kredensial untuk mengakses Control</p>

            <?php if (isset($error)) { ?>
                <div class="error-box">
                    <i class="fas fa-exclamation-circle"></i>
                    <?= $error ?>
                </div>
            <?php } ?>

            <form method="POST">
                <div class="form-group">
                    <label>NIK</label>
                    <div class="input-wrap">
                        <i class="fas fa-id-badge"></i>
                        <input type="text" name="nik" placeholder="Masukkan NIK" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <div class="input-wrap">
                        <i class="fas fa-lock"></i>
                        <input type="password" name="password" placeholder="Masukkan password" required>
                    </div>
                </div>

                <button type="submit" name="login" class="btn-login">
                    <i class="fas fa-sign-in-alt"></i> Masuk
                </button>
            </form>

            <div class="login-footer">
                <i class="fas fa-lock"></i> Sistem Antrian — Akses Terbatas
            </div>

        </div>
    </div>

</body>
</html>