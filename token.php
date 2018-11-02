<?php
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
    print_r($speechToText->getToken());
    
