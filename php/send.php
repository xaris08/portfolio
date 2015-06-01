<?php

if (is_ajax()) 
        $name = htmlspecialchars($_POST['name']);
        $msg = htmlspecialchars($_POST['msg']);
        $headers = "From: " . $_POST['mail'] . "\r\n";

        // mail($to,$subject,$txt,$headers);
        bool mail('charis.katsavos@gmail.com', 'Mail from page ', str_replace("\n.", "\n..", $msg), $headers);

        // $return = $_POST;
        //$return["json"] = json_encode($return); //JSON encode $return

        echo json_encode({success: true, msg: 'Message sent.'});


function is_ajax() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

?>