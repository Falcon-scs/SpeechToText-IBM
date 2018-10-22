<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $errors = "";
        $path = 'uploads/';
        $extensions = ['flac', 'basic', 'l16', 'mp3', 'mulaw', 'ogg', 'wav'];

        $file_name = $_FILES['file']['name'];
        $file_tmp = $_FILES['file']['tmp_name'];
        $file_type = $_FILES['file']['type'];
        $file_size = $_FILES['file']['size'];
        $exploded = explode('.', $file_name);
        $file_ext = strtolower($exploded[count($exploded)-1]);

        $file = $path . $file_name;

        if (!in_array($file_ext, $extensions)) {
            $errors = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
            echo json_encode(array("success" => false, "message" => $errors));
            exit;
        }

        if (empty($errors)) {
            if (@move_uploaded_file($file_tmp, $file)) {
                echo json_encode(array("success" => true, "url" => $file));
            } else {
                echo json_encode(array("success" => false, "message" => "Uploading Error."));
            }
            exit;
        }

        if ($errors) {
            echo json_encode(array("success" => false, "message" => "Uploading Error."));
            exit;
        }

    }
}
