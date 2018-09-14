<?php
require_once('components/DB.php');
$db = Db::getConnection();
$access = false;
if ($_GET['auth']) {
    $token = $_SERVER['HTTP_X_AUTHORIZATION'];
    $sql = "SELECT id, name, lastname, mail, address , role FROM users WHERE token = :token";
    $result = $db->prepare($sql);
    $result->bindParam(':token', $token, PDO::PARAM_STR);
    $result->execute();
    $user = $result->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        $access = true;
    } else {
        $access = false;
    }
    if ($access) {
        echo json_encode($user);
    }
} else {
    $login = htmlspecialchars(strip_tags(trim($_POST['login'])));
    $password = htmlspecialchars(strip_tags(trim(md5($_POST['password']))));

    $sql = "SELECT id, name, role  FROM users WHERE mail = :login AND password = :password ";
    $result = $db->prepare($sql);
    $result->bindParam(':login', $login, PDO::PARAM_STR);
    $result->bindParam(':password', $password, PDO::PARAM_STR);
    $result->execute();

    $user = $result->fetch();
    if ($user) {
        $salt = mt_rand(100, 999);
        $tm = time();
        $token2 = md5(md5($password + $salt) + $tm);

        $id = $user['id'];
        $sql = "UPDATE users SET  token = :token WHERE id = :id";

        $result = $db->prepare($sql);
        $result->bindParam(':token', $token2, PDO::PARAM_STR);
        $result->bindParam(':id', $id, PDO::PARAM_INT);
        $result->execute();
        $userData = [
            'user_id' => $user['id'],
            'user_name' => $user['name'],
            'user_token' => $token2,
            'user_role'=>$user['role']
        ];

        echo json_encode($userData);
    } else {
        echo json_encode(false);
    }


}



