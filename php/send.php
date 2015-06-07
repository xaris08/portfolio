<?php

if (is_ajax()) {
        if (isset($_POST["name"]) && !empty($_POST["name"]) && isset($_POST["msg"]) 
                && !empty($_POST["msg"]) && isset($_POST["from"]) && !empty($_POST["from"])) {

                $name = htmlspecialchars($_POST['name']);
                $msg = htmlspecialchars($_POST['msg']);
                $from = htmlspecialchars($_POST['from']);


                $subject  = "Portfolio msg from: ".$from;
                $body     = "Name: ".$name." and message: ".$msg;

                $mailsend=mail("charis.katsavos@gmail.com","$subject","$body");

                // require('PHPMailerAutoload.php');
                // $mail = new PHPMailer;
                // $mail->IsSMTP();
                // $mail->SMTPAuth      = true;
                // $mail->Host     = "smtp.live.com";
                // $mail->From     = "xaris08@hotmail.com";
                // $mail->AddAddress("charis.katsavos@gmail.com");
                // $mail->Subject  = "Portfolio msg from: ";
                // $mail->Body     = "Name: and message: ";

                $arrayName = array();
                if($mailsend) {
                        $arrayName["success"] = true;
                        // $arrayName['error'] = $mail->ErrorInfo;
                } else {
                        $arrayName["success"] = false;
                }
                echo json_encode($arrayName);
        }
}

function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}


?>