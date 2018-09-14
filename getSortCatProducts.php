<?php
require_once('components/DB.php');
$db = Db::getConnection();
$products = array();
$page = $_GET['page'];
$cat_links = $_GET['cat_links'];

$sql = "SELECT name FROM categories WHERE links = :links";
$result = $db->prepare($sql);
$result->bindParam(':links', $cat_links, PDO::PARAM_STR);
$result->execute();
$category = $result->fetch();

if($category){

    if (empty($_GET['sorting'])) {
        $result = $db->query("SELECT * FROM products WHERE cat_links = '$cat_links' ORDER BY id ASC LIMIT $page,6");
    } else {
        switch ($_GET['sorting']) {
            case 'default':
                $result = $db->query("SELECT * FROM products WHERE cat_links = '$cat_links' ORDER BY id ASC LIMIT $page,6");
                break;
            case 'news':
                $result = $db->query("SELECT * FROM products WHERE cat_links = '$cat_links' ORDER BY id DESC LIMIT $page,6");
                break;
            case 'price_ask':
                $result = $db->query("SELECT * FROM products WHERE cat_links = '$cat_links' ORDER BY price ASC LIMIT $page,6");
                break;
            case 'price_desk':
                $result = $db->query("SELECT * FROM products WHERE cat_links = '$cat_links' ORDER BY price DESC LIMIT $page,6");
                break;
        }
    }
    $i = 0;
    while ($row = $result->fetch()) {
        $products[$i]['id'] = $row['id'];
        $products[$i]['title'] = $row['title'];
        $products[$i]['price'] = $row['price'];
        $products[$i]['img'] = $row['img'];
        $i++;
    }
    echo json_encode($products);
}else{
    echo json_encode($category);
}