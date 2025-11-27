<?php
    require "DB.php";

    $userID = $_POST['userID'];;
    $password = $_POST['userPassword'];;

    $stmt = $conn->prepare("SELECT uid, password, nickname FROM loginTable WHERE id = ?");
    $stmt->bind_param( "s", $userID);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($uid, $hashedPassword, $nickname); // 컬럼 값을 변수에 바인딩
        $stmt->fetch();

    if (password_verify($password, $hashedPassword)) {
        session_start();
        $_SESSION['uid'] = $uid;
        $_SESSION['nickname'] = $nickname;
        echo "<script>
        alert('".$nickname."님 환영합니다');
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