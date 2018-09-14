<?php
require_once('components/DB.php');
$db = Db::getConnection();
$user_id = htmlspecialchars(strip_tags(trim($_POST['user_id'])));
$deleteReserve = htmlspecialchars(strip_tags(trim($_POST['delete'])));
$products = $_POST['cart'];

if ($deleteReserve) {
    $sql = "DELETE FROM reserve_order WHERE user_id = :user_id";
    $result = $db->prepare($sql);
    $result->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $result->execute();

$count=0;

       if($count<1){
           $f = json_decode($products, true);
           foreach ($f as $item => $value) {
               $val = $value['count'];
               $id = $item;
               $sql = "UPDATE products SET  count = count + $val WHERE id = :id";
               $result = $db->prepare($sql);
               $result->bindParam(':id', $id, PDO::PARAM_INT);
               $result->execute();
           }
           $count++;
       }




} else {
    $sql = "SELECT id  FROM reserve_order WHERE user_id = :user_id";
    $result = $db->prepare($sql);
    $result->bindParam(':user_id', $user_id, PDO::PARAM_STR);
    $result->execute();
    $id = $result->fetch();
    if ($id) {
        echo json_encode(false);
    } else {
        echo json_encode(true);
    }
}






