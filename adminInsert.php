<?php
require_once('components/DB.php');
$db = Db::getConnection();
$title = $_POST['title'];
$discription = $_POST['discription'];
$minidiscription = $_POST['minidescription'];
$count = $_POST['count'];
$cat_links = $_POST['catygory'];
$img = $_POST['file'];
$price = $_POST['price'];
$sp_offers = 1;
$sub_cat_id = 1;
$composition = 'werty';
$id = $_POST['id'];
$edit = $_POST['edit'];
$insert = $_POST['insert'];
$update = $_POST['update'];
$delete = $_POST['delete'];

if ($edit) {
    $orders = array();
    $result = $db->query("SELECT * FROM products WHERE id = $id");
    while ($row = $result->fetch()) {
        $orders[$i]['id'] = $row['id'];
        $orders[$i]['title'] = $row['title'];
        $orders[$i]['discription'] = $row['discription'];
        $orders[$i]['minidiscription'] = $row['minidiscription'];
        $orders[$i]['price'] = $row['price'];
        $orders[$i]['count'] = $row['count'];
        $orders[$i]['img'] = $row['img'];
        $i++;
    }
    echo json_encode($orders);
}

if ($insert) {
    $sql = "INSERT INTO products (title, discription, minidiscription, composition, price,img,cat_links,sp_offers,sub_cat_id,count) VALUES(:title,:discription,:minidiscription,:composition,:price,:img,:cat_links,:sp_offers,:sub_cat_id,:count)";
    $result = $db->prepare($sql);
    $result->bindParam(':title', $title, PDO::PARAM_STR);
    $result->bindParam(':discription', $discription, PDO::PARAM_STR);
    $result->bindParam(':minidiscription', $minidiscription, PDO::PARAM_STR);
    $result->bindParam(':composition', $composition, PDO::PARAM_STR);
    $result->bindParam(':price', $price, PDO::PARAM_STR);
    $result->bindParam(':img', $img, PDO::PARAM_STR);
    $result->bindParam(':cat_links', $cat_links, PDO::PARAM_STR);
    $result->bindParam(':sp_offers', $sp_offers, PDO::PARAM_INT);
    $result->bindParam(':sub_cat_id', $sub_cat_id, PDO::PARAM_INT);
    $result->bindParam(':count', $count, PDO::PARAM_INT);
    $result->execute();
}

if ($update) {
    $sql = "UPDATE products SET   title = :title, discription = :discription, minidiscription = :minidiscription, price = :price, img = :img, cat_links = :cat_links, count = :count WHERE id = :id";
    $result = $db->prepare($sql);
    $result->bindParam(':id', $id, PDO::PARAM_INT);
    $result->bindParam(':title', $title, PDO::PARAM_STR);
    $result->bindParam(':discription', $discription, PDO::PARAM_STR);
    $result->bindParam(':minidiscription', $minidiscription, PDO::PARAM_STR);
    $result->bindParam(':price', $price, PDO::PARAM_STR);
    $result->bindParam(':img', $img, PDO::PARAM_STR);
    $result->bindParam(':cat_links', $cat_links, PDO::PARAM_STR);
    $result->bindParam(':count', $count, PDO::PARAM_INT);
    $result->execute();
}

if($delete){
    $sql = "DELETE FROM products WHERE id = :id";
    $result = $db->prepare($sql);
    $result->bindParam(':id', $id, PDO::PARAM_INT);
    $result->execute();
}
