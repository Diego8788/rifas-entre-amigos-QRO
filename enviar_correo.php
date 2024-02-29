<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$smtpHost = 'smtp.gmail.com';
$smtpUsername = 'diegomo.tij20@utsjr.edu.mx';
$smtpPassword = '172710012';
$smtpPort = 587;

$nombre = $_POST['nombre'];
$email = $_POST['email'];
$mensaje = $_POST['mensaje'];

$mail = new PHPMailer(true);
$response = []; // Para almacenar la respuesta que se enviará al cliente

try {
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->SMTPSecure = 'tls';
    $mail->Port = $smtpPort;

    // Configuración de remitente y destinatario
    $mail->setFrom($email, $nombre);
    $mail->addAddress('pedrogusmanm2023@gmail.com');

    // Establecer la dirección de respuesta en el correo electrónico del remitente
    $mail->addReplyTo($email, $nombre); // $email y $nombre son la dirección de correo electrónico y el nombre del remitente

    $mail->isHTML(true);
    $mail->Subject = 'Nuevo mensaje de contacto';
    $mail->Body    = $mensaje;

    $mail->send();

    // Establecer la respuesta como éxito
    $response['success'] = true;
    $response['message'] = 'El mensaje se envió correctamente!';
} catch (Exception $e) {
    // Si hay un error, establecer la respuesta como fallida
    $response['success'] = false;
    $response['message'] = 'Hubo un error al enviar el mensaje: ' . $mail->ErrorInfo;
}

// Convertir la respuesta a formato JSON
$jsonResponse = json_encode($response);

// Imprimir la respuesta JSON
echo $jsonResponse;
?>
