<?php
require_once('components/DB.php');
$db = Db::getConnection();
//$time = $booking_end_time = date('Y-m-d H:i:s');
$sql = "DELETE FROM reserve_order WHERE booking_end_time < NOW() ";
$result = $db->prepare($sql);
$result->execute();