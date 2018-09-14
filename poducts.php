<?php
require_once('components/DB.php');
$db = Db::getConnection();
$products = array();
$allAdmin = $_POST['all'];
if (isset($allAdmin)) {
    $result = $db->query("SELECT * FROM products  ORDER BY id ASC");
    $i = 0;
    while ($row = $result->fetch()) {
        $products[$i]['id'] = $row['id'];
        $products[$i]['title'] = $row['title'];
        $products[$i]['price'] = $row['price'];
        $products[$i]['img'] = $row['img'];
        $products[$i]['count'] = $row['count'];
        $i++;
    }
} else {
    if (isset($_GET['specials'])) {
        $sp = $_GET['specials'];
        $result = $db->query("SELECT * FROM products WHERE sp_offers = $sp ORDER BY id ASC LIMIT 8");
    } else {
        if (empty($_GET['start'])) {
            $_GET['start'] = 0;
        }
        $start = $_GET['start'];
        $result = $db->query("SELECT * FROM products ORDER BY id ASC LIMIT $start,6");
    }
    $i = 0;
    while ($row = $result->fetch()) {
        $products[$i]['id'] = $row['id'];
        $products[$i]['title'] = $row['title'];
        $products[$i]['price'] = $row['price'];
        $products[$i]['img'] = $row['img'];
        $i++;
    }
}

echo json_encode($products);
