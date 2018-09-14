<?php
require_once('components/DB.php');
$db = Db::getConnection();
$user_id = htmlspecialchars(strip_tags(trim($_POST['user_id'])));
$select = $_POST['select'];

if ($select) {
    $result = $db->prepare("SELECT products FROM reserve_order WHERE user_id = ?");
    $result->execute(array($user_id));
    $name = $result->fetchColumn();
    if (empty($name)) {
        echo 'no';
    } else {
        echo $name;
    }
}


