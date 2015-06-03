<?php

if (is_ajax()) {
        if (isset($_POST["name"]) && !empty($_POST["name"]) && isset($_POST["msg"]) 
                && !empty($_POST["msg"]) && isset($_POST["from"]) && !empty($_POST["from"])) {

                $name = htmlspecialchars($_POST['name']);
                $msg = htmlspecialchars($_POST['msg']);
                $from = htmlspecialchars($_POST['from']);

                require('PHPMailerAutoload.php');

                $mail = new PHPMailer;
                $mail->IsSMTP();  // telling the class to use SMTP
                $mail->Host     = "zmail.eurodyn.com"; // smtp.live.com
                $mail->From     = "charis.katsavos@eurodyn.com";
                $mail->AddAddress("charis.katsavos@gmail.com");
                $mail->Subject  = "Portfolio msg from: ".$from;
                $mail->Body     = "Name: ".$name." and message: ".$msg;

                $arrayName = array("from" =>  $from);
                // if(!$mail->Send()) {
                //         $arrayName["success"] = "false";
                //         // $arrayName['error'] = $mail->ErrorInfo;
                // } else {
                //         $arrayName["success"] = "true";
                // }
                $arrayName["success"] = "true";
                echo json_encode($arrayName);
        }
}

function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}


?>