<?php
/*
     Plugin Name: Epchilem
     Plugin URI: http://google.com
     Description: Test Plugin
     Author: Ailiniyazi Maimaiti
     Author URL: http://google.com
     Version 0.0.1
     Text Domain: Epchilem
     License: GPLv2
*/

function register_session()
{
     if (!session_id()) {
          session_start();
     }
}
add_action('init', 'register_session');

/** Get and set session */
function get_session_var()
{
     if (isset($_GET['uls'])) {
          echo $_GET['uls'];
          $_SESSION['uls'] = $_GET['uls'];
     } else {
          $_SESSION['uls'] = 'uu';
     }
}
add_action('init', 'get_session_var');

/** Enqueue files */
function insert_convert_file()
{
     baghla();
     // wp_register_script('to_uly', plugins_url('/epchilem/scripts/to_uly.js'), array(), false, true);
     // wp_enqueue_script('to_uly');
}
add_action('wp_enqueue_scripts', 'insert_convert_file');


function insert_epchilem_div_before_post($content)
{
     if (is_single()) {
          $beforecontent = '<div class="epchilem" style=" padding-right: 60px; padding-top: 6px;"> <a href="?uls=us">&#1059;&#1081;&#1171;&#1091;&#1088;&#1095;&#1241;</a> | <a href="?uls=ul">&#85;&#121;&#103;&#104;&#117;&#114;&#99;&#104;&#101;</a> | <a href="?uls=uu">&#1574;&#1735;&#1610;&#1594;&#1735;&#1585;&#1670;&#1749;</a> </div>';
     } else {
          $beforecontent = '';
     }
     $fullcontent = $beforecontent . $content;

     return $fullcontent;
}
add_filter('the_content', 'insert_epchilem_div_before_post');

function baghla()
{
     if (isset($_GET['uls'])) {
          if ($_GET['uls'] == 'ul') {
               $_SESSION['uls'] = "ul";
          } else if ($_GET['uls'] == 'us') {
               $_SESSION['uls'] = "us";
          }  else if ($_GET['uls'] == 'uu') {
               $_SESSION['uls'] = "uu";
          }  else {
               if (!isset($_SESSION['uls'])) {
                    $_SESSION['uls'] = "uu";
               }
          }
     } else {
          if (!isset($_SESSION['uls'])) {
               $_SESSION['uls'] = "uu";
          }
     }
}
