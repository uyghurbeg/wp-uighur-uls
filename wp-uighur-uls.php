<?php
/*
     Plugin Name: wp-uighur-uls
     Plugin URI: https://uyghur.blog
     Description: ئۇيغۇر ئەرەب ئېلىپبەسىنى ئۇيغۇر لاتىن ئېلىپبەسى ۋە ئۇيغۇر كىرىل ئېلىپبەسىگە ئايلاندۇرىدىغان قىستۇرما | A plugin to convert Uyghur Arabic Alphabet to Uyghur Laten Alphabet and Uyghur Crillic Alphabet
     Author: Uyghurbeg
     Author URI: https://uyghur.blog
     Version 0.0.1
     Text Domain: wp-uighur-uls
     License: GPLv2
*/

function register_session()
{
     if (!session_id()) {
          session_start();
     }
}
add_action('init', 'register_session');

/** Enqueue files */
function insert_convert_file()
{
     setup_session();
     convert_alphabet();
}
add_action('wp_enqueue_scripts', 'insert_convert_file');

function insert_epchilem_div_before_post($content)
{
     if (is_single()) {
          $beforecontent = '<div class="epchilem" style=" padding-right: 60px; padding-top: 6px;  text-transform: lowercase; !important"> <a href="?uls=us">&#1059;&#1081;&#1171;&#1091;&#1088;&#1095;&#1241;</a> | <a href="?uls=ul">&#85;&#121;&#103;&#104;&#117;&#114;&#99;&#104;&#101;</a> | <a href="?uls=uu">&#1574;&#1735;&#1610;&#1594;&#1735;&#1585;&#1670;&#1749;</a> </div>';
     } else {
          $beforecontent = '';
     }
     $fullcontent = $beforecontent . $content;

     return $fullcontent;
}
add_filter('the_content', 'insert_epchilem_div_before_post');

function setup_session()
{
     if (isset($_GET['uls'])) {
          if ($_GET['uls'] == 'ul') {
               $_SESSION['uls'] = "ul";
          } else if ($_GET['uls'] == 'us') {
               $_SESSION['uls'] = "us";
          }  else if ($_GET['uls'] == 'uu') {
               $_SESSION['uls'] = "uu";
          }  
     } else {
          if (!isset($_SESSION['uls'])) {
               $_SESSION['uls'] = "uu";
          }
     }
}

function convert_alphabet()
{
     if ($_SESSION['uls'] == "ul") {
          //Register convert script
          wp_register_script('to_uly', plugins_url('/epchilem/scripts/to_uly.js'), array(), false, true);
          wp_enqueue_script('to_uly');
          //Register converted alphabet style
          wp_register_style('ltr-style', get_template_directory().'/ltr.css');
          wp_enqueue_style('ltr-style');
     } else if ($_SESSION['uls'] == "us") {
          //Register convert script
          wp_register_script('to_us', plugins_url('/epchilem/scripts/to_usy.js'), array(), false, true);
          wp_enqueue_script('to_us');
          //Register converted alphabet style
          wp_register_style('ltr-style', get_template_directory() . '/ltr.css');
          wp_enqueue_style('ltr-style');
     } else if ($_SESSION['uls'] == "uu") {
          //Todo: Add latin to unicode and latin to crillic
          // wp_register_script('to_uu', plugins_url('/epchilem/scripts/to_uy.js'), array(), false, true);
          // wp_enqueue_script('to_uu');
          //Register converted alphabet style
          // wp_register_style('rtl-style', get_template_directory() . '/rtl.css');
          // wp_enqueue_style('rtl-style');
     }
}