<?php
require_once('components/DB.php');
$db = Db::getConnection();
$products = $_POST['cart'];
$user_id = htmlspecialchars($_POST['user']);
$comment = htmlspecialchars(strip_tags(trim($_POST['comment'])));
$delivery = $_POST['delivery'];
$reserve = $_POST['reserve'];
$booking_end_time = date('Y-m-d H:i:s', strtotime("+5 min"));
$payOrder = $_POST['payorder'];
if ($payOrder) {
    payOrder($db, $user_id);
} else {
    if (isset($reserve)) {
        $sql = "INSERT INTO reserve_order (products, user_id, comment, delivery ,booking_end_time) VALUES
 (:products, :user_id, :comment, :delivery, :booking_end_time)";
        $result = $db->prepare($sql);
        $result->bindParam(':products', $products, PDO::PARAM_STR);
        $result->bindParam(':comment', $comment, PDO::PARAM_STR);
        $result->bindParam(':delivery', $delivery, PDO::PARAM_STR);
        $result->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $result->bindParam(':booking_end_time', $booking_end_time, PDO::PARAM_STR);
        $result->execute();
        $id = $db->lastInsertId();
        updateCount($products, $db);
        echo json_encode(array('id' => $id, 'user_id' => $user_id));
    } else {
        $sql = "INSERT INTO orders (products, user_id, comment, delivery) VALUES
 (:products, :user_id, :comment, :delivery)";
        $result = $db->prepare($sql);
        $result->bindParam(':products', $products, PDO::PARAM_STR);
        $result->bindParam(':comment', $comment, PDO::PARAM_STR);
        $result->bindParam(':delivery', $delivery, PDO::PARAM_STR);
        $result->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $result->execute();
        $id = $db->lastInsertId();
        updateCount($products, $db);
        echo json_encode($id);
    }
}


function updateCount($products, $db)
{

    $f = json_decode($products, true);
    foreach ($f as $item => $value) {
        $val = $value['count'];
        $id = $item;
        $sql = "UPDATE products SET  count = count - $val WHERE id = :id";
        $result = $db->prepare($sql);
        $result->bindParam(':id', $id, PDO::PARAM_INT);
        $result->execute();
    }
}

function payOrder($db, $user_id)
{
    $result = $db->prepare("SELECT user_id, products, comment, delivery, booking_end_time FROM reserve_order WHERE user_id = :user_id");
    $result->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $result->execute();
    $select = $result->fetch();

    $products = $select['products'];
    $comment = $select['comment'];
    $delivery = $select['delivery'];
    $user_id = $select['user_id'];
    $time = $select['booking_end_time'];

    $sql = "INSERT INTO orders (products, user_id, comment, delivery ,time) VALUES
 (:products, :user_id, :comment, :delivery, :time)";
    $result = $db->prepare($sql);
    $result->bindParam(':products', $products, PDO::PARAM_STR);
    $result->bindParam(':comment', $comment, PDO::PARAM_STR);
    $result->bindParam(':delivery', $delivery, PDO::PARAM_STR);
    $result->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $result->bindParam(':time', $time, PDO::PARAM_STR);
    $result->execute();
    $id = $db->lastInsertId();

    $sql = "DELETE FROM reserve_order WHERE user_id = :user_id";
    $result = $db->prepare($sql);
    $result->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $result->execute();

    echo json_encode($id);

}