<?php
header('Content-Type: text/plain; charset=utf-8');

// 必填字段验证
if (!isset($_POST['email']) || trim($_POST['email']) === '') {
    http_response_code(400);
    die('MF001'); // 必填字段缺失
}

// 邮箱格式验证
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die('MF003'); // 邮箱格式错误
}

// 邮件配置
$subject = "SNIBypassGUI 最新版本";
$server_email = "noreply@snibypassgui.netlib.re";
$from_name = "SNIBypassGUI";
$filePath = __DIR__ . '/files/SNIBypassGUI.exe';

// 检查附件文件
if (!file_exists($filePath)) {
    error_log("附件文件不存在: $filePath");
    http_response_code(500);
    die('MF254'); // 服务器文件错误
}

// 构建 MIME 邮件
$boundary = md5(uniqid(time()));
$headers = "From: $from_name <$server_email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"";

$body = "亲爱的用户，\n\n感谢您使用 SNIBypassGUI。请在附件中找到最新版本的程序文件。\n\n此邮件由系统自动发送，请勿回复。";

// 邮件正文部分
$message = "--$boundary\r\n";
$message .= "Content-Type: text/plain; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$message .= $body . "\r\n\r\n";

// 附件部分
$fileContent = file_get_contents($filePath);
$encodedContent = chunk_split(base64_encode($fileContent));

$message .= "--$boundary\r\n";
$message .= "Content-Type: application/octet-stream; name=\"SNIBypassGUI.exe\"\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n";
$message .= "Content-Disposition: attachment; filename=\"SNIBypassGUI.exe\"\r\n\r\n";
$message .= $encodedContent . "\r\n";
$message .= "--$boundary--";

// 发送邮件
if (mail($email, $subject, $message, $headers)) {
    echo 'MF000'; // 发送成功
} else {
    error_log("邮件发送失败 - 收件人: $email");
    http_response_code(500);
    echo 'MF254'; // 邮件服务错误
}
?>