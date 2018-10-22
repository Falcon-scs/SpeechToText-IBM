<?php
    require_once __DIR__ . '/vendor/autoload.php';
    require_once __DIR__ . '/autoload.php';
    error_reporting(E_ALL);
    ini_set('max_execution_time', 18000000000);
    $config = new Config();
    $config->setUsername('d1dfee2b-02f1-466d-9476-a09705e6518b');
    $config->setPassword('rr0LewXCMicq');
    $speechToText = new SpeechToText($config);
    $params = ['headers' => 'X-Brideo'];
    $speechToText->config->setConfig($params);
    print_r($speechToText->getToken());
    
