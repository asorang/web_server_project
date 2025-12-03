<?php
session_start();
session_destroy();
echo "<script>
        alert('로그아웃 되었습니다.');
        window.location.href = './login.php'; // 확인 누르면 이동
      </script>";
        exit();
?>