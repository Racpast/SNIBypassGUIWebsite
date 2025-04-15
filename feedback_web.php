<?php
header('Content-Type: text/plain; charset=utf-8');

$to = "yaojun.mail@qq.com";
$server_email = "feedback@snibypassgui.netlib.re";
$from_name = "SNIBypassGUI Feedback";

// 验证必填字段
$required_fields = ['name', 'subject', 'email', 'message'];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || trim($_POST[$field]) === '') {
        http_response_code(400);
        die('MF001'); // 必填字段缺失
    }
}

// 过滤输入数据
$name = htmlspecialchars(trim($_POST['name']));
$subject = str_replace(["\r", "\n"], '', trim($_POST['subject']));
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars(trim($_POST['message']));

// 邮箱验证
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die('MF003'); // 邮箱格式错误
}

// 构造邮件内容
$body = "称呼：$name\n";
$body .= "主题：$subject\n";
$body .= "邮箱：$email\n";
$body .= "IP地址：{$_SERVER['REMOTE_ADDR']}\n\n";
$body .= "反馈内容：\n$message";

// 邮件头设置
$headers = "From: $from_name <$server_email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 发送邮件
if (mail($to, $subject, $body, $headers, "-f$server_email")) {
    echo 'MF000'; // 成功代码
} else {
    http_response_code(500);
    error_log("邮件发送失败 - 主题: $subject | 邮箱: $email");
    echo 'MF254'; // PHPMailer错误代码
}
?>