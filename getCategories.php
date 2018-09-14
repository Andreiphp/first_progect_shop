<?php
require_once('components/DB.php');
$db = Db::getConnection();
$categories = array();
if ($_GET['sub_cat']) {
    $result = $db->query("SELECT * FROM subCategories ORDER BY id ASC");
    $i = 0;
    while ($row = $result->fetch()) {
        $categories[$i]['id'] = $row['id'];
        $categories[$i]['title'] = $row['title'];
        $categories[$i]['img'] = $row['img'];
        $i++;
    }
} else {
    $result = $db->query("SELECT * FROM categories ORDER BY id ASC");
    $i = 0;
    while ($row = $result->fetch()) {
        $categories[$i]['id'] = $row['id'];
        $categories[$i]['name'] = $row['name'];
        $categories[$i]['links'] = $row['links'];
        $i++;
    }
}


echo json_encode($categories);