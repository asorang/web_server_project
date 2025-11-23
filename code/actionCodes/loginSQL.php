<?php
    require "DBFirst.php";

    $userID = $_POST['userID'];;
    $password = $_POST['userPassword'];;

    $stmt = $conn->prepare("SELECT uid, password FROM loginTable WHERE id = ?");
    $stmt->bind_param( "s", $userID);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($uid, $hashedPassword); // 컬럼 값을 변수에 바인딩
        $stmt->fetch();

    if (password_verify($password, $hashedPassword)) {
        session_start();
        $_SESSION['uid'] = $uid;
        echo "<script>
        alert('회원가입이 되었습니다.');
        window.location.href = '../main.php'; // 확인 누르면 이동
      </script>";
        exit();
    } else {
        echo "<script>
            alert('비밀번호가 잘못되었습니다.');
            history.back(); // 이전 페이지로 돌아가기
          </script>";
        exit;
    }
    } else {
        echo "<script>
            alert('사용자가 존재하지 않습니다.');
            history.back(); // 이전 페이지로 돌아가기
          </script>";
        exit;
    }
?>