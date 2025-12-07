<?php
    require "DB.php";

    $username = $_POST['username'];
    $phone = $_POST['phone'];

    $stmt = $conn->prepare("SELECT id FROM loginTable WHERE name = ? AND phoneNumber = ?");
    $stmt->bind_param( "si", $username,$phone);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($id); // 컬럼 값을 변수에 바인딩
        $stmt->fetch();
        
        echo "<script>
        alert('당신의 아이디는 ".$id."입니다');
        window.location.href = '../login.php'; // 확인 누르면 이동
      </script>";
        exit();
    } else {
        echo "<script>
            alert('사용자가 존재하지 않습니다.');
            history.back(); // 이전 페이지로 돌아가기
          </script>";
        exit();
    }
    

?>