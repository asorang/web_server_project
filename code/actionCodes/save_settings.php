<?php
require "DB.php";
session_start();
$uid = $_SESSION['uid'] ?? 0;

if ($uid === 0) {
    die("로그인 필요");
}

// POST 값 가져오기
$bgm = isset($_POST['bgm-volume']) ? (int)$_POST['bgm-volume'] : 50;
$sfx = isset($_POST['sfx-volume']) ? (int)$_POST['sfx-volume'] : 80;

// 배열 → JSON
$settings = json_encode([
    'bgm' => $bgm,
    'sfx' => $sfx
], JSON_UNESCAPED_UNICODE);

// DB 연결

// 업데이트
$stmt = $conn->prepare("UPDATE userTable SET setting = ? WHERE uid = ?");
$stmt->bind_param('si', $settings, $uid);
if ($stmt->execute()) {
    echo "<script>
        alert('저장되었습니다');
        window.location.href = '../settings.php'; // 확인 누르면 이동
      </script>";
        exit;
} else {
    echo "저장 실패: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
