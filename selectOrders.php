<?php
require_once('components/DB.php');
$db = Db::getConnection();
$user_id = $_POST['user_id'];
//$result = $db->query("SELECT id, time, delivery, comment FROM orders WHERE user_id = $user_id ORDER BY id");
$i = 0;
$orders = array();

if ($user_id) {
    $result = $db->query("SELECT id, time, delivery, comment FROM orders WHERE user_id = $user_id ORDER BY id");
    while ($row = $result->fetch()) {
        $orders[$i]['id'] = $row['id'];
        $orders[$i]['time'] = $row['time'];
        $orders[$i]['delivery'] = $row['delivery'];
        $orders[$i]['comment'] = $row['comment'];
        $i++;
    }
    echo json_encode($orders);
}





