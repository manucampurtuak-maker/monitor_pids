<?php

$host = getenv("MYSQLHOST") ?: "localhost";
$username = getenv("MYSQLUSER") ?: "root";
$password = getenv("MYSQLPASSWORD") ?: "";
$database = getenv("MYSQLDATABASE") ?: "db_admin";
$port = getenv("MYSQLPORT") ?: 3306;

// Membuat koneksi
$conn = mysqli_connect($host, $username, $password, $database, $port);

// Cek koneksi
if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

?>