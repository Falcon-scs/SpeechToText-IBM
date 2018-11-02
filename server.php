<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/vendor/autoload.php';
    require_once __DIR__ . '/autoload.php';
    error_reporting(E_ALL);
    ini_set('max_execution_time', 18000000000);
    $config = new Config();
    $config->setUsername('');
    $config->setPassword('');
    $speechToText = new SpeechToText($config);
    $params = ['headers' => 'X-Brideo'];
    $speechToText->config->setConfig($params);
    $filePath = $_POST['path'];
    $file_format = $_POST['file_format'];
    $lng = $_POST['language']; //'ja-JP_BroadbandModel';
    $uri = 'https://stream.watsonplatform.net/speech-to-text/api/v1/recognize';
    $speechToText->recognize($filePath, $file_format, $lng, $uri);
    $result = $speechToText->getTranscripts();
    $text = '';
    foreach($result as $row) {
      $text = $text.$row.'<br>';
    }
    print_r($text);
}
