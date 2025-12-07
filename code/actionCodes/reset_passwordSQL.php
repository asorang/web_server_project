<?php
require "DB.php";

$userID = $_POST['userID'];
$newPassword = $_POST['newPassword'];

// 비밀번호 해시
$hashed = password_hash($newPassword, PASSWORD_DEFAULT);

// DB 업데이트
$stmt = $conn->prepare("UPDATE loginTable SET password = ? WHERE id = ?");
$stmt->bind_param("ss", $hashed, $userID);
$result = $stmt->execute();

if ($result) {
    echo "<script>
        alert('비밀번호가 성공적으로 변경되었습니다.');
        window.location.href = '../login.php';
    </script>";
} else {
    echo "<script>
        alert('오류가 발생했습니다. 다시 시도해주세요.');
        history.back();
    </script>";
}
?>
