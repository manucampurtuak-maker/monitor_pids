<?php
session_start();
if (!isset($_SESSION['karyawan'])) {
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Control Antrian</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Control Antrian</h1>
        <a href="logout.php" class="btn-logout">Logout</a>
    </div>

    <div class="form-group">
        <label>No Urut (Otomatis)</label>
        <div id="noAntrian" class="nomor"></div>
    </div>

    <div class="form-group">
        <label>Nomor SI</label>
        <input type="text" id="noSI" placeholder="Masukkan Nomor SI">
    </div>

    <div class="form-group">
        <label>Gate</label>
        <input type="text" id="gate" placeholder="Masukkan Gate">
    </div>
<button class="btn" onclick="tambahAntrian()">Tambah Antrian</button>
<button class="btn-yellow" onclick="ulangPanggilan()">Ulangi Panggilan</button>
<button class="btn btn-red" onclick="resetAntrian()">Reset Antrian</button>
<a href="fids-control.html" class="btn">PIDS Control</a>


    <div class="nav">
        <a href="monitor.html">Monitor</a>
        <a href="riwayat.html">Riwayat</a>
    </div>
</div>

<script src="script.js"></script>
<script>
    showNextNumber();
</script>
</body>
</html>
