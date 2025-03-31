<?php

$environment = getenv('APP_ENV') ?: 'local';

$file = __DIR__ . '/../.env.' . $environment;
if (file_exists($file)) {
    copy($file, __DIR__ . '/../.env');
}
