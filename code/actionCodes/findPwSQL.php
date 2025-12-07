<?php
    require "DB.php";

    $username = $_POST['userID'];
    $phone = $_POST['phone'];

    $stmt = $conn->prepare("SELECT id FROM loginTable WHERE id = ? AND phoneNumber = ?");
    $stmt->bind_param( "si", $username,$phone);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
    // 인증 성공 → 비밀번호 변경 페이지로 이동
    echo "<script>
        alert('인증되었습니다. 새로운 비밀번호를 입력해주세요.');
        window.location.href = '../reset_password.php?';
    </script>";
    exit();
} else {
    echo "<script>
        alert('사용자가 존재하지 않습니다.');
        history.back();
    </script>";
    exit();
}
    

?>