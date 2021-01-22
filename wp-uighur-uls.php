<?php

/**
 * Plugin Name:       wp-uighur-uls
 * Plugin URI:        https://github.com/uyghurbeg/wp-uighur-uls
 * Description:       ئۇيغۇر ئەرەب ئېلىپبەسىنى ئۇيغۇر لاتىن ئېلىپبەسى ۋە ئۇيغۇر كىرىل ئېلىپبەسىگە ئايلاندۇرىدىغان Wordpress قىستۇرمىسى | A Wordpress plugin to convert Uyghur Arabic Alphabet to Uyghur Laten Alphabet and Uyghur Crillic Alphabet
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Uyghurbeg
 * Author URI:        https://uyghur.blog
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-uighur-uls
 * Domain Path:       /plugins
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

function setup_session()
{
     if (isset($_GET['uls'])) {
          if ($_GET['uls'] == 'ul') {
               $_SESSION['uls'] = "ul";
          } else if ($_GET['uls'] == 'us') {
               $_SESSION['uls'] = "us";
          } else if ($_GET['uls'] == 'uu') {
               $_SESSION['uls'] = "uu";
          }
     } else if (isset($_GET['Uls'])) {
          if ($_GET['Uls'] == 'ul') {
               $_SESSION['uls'] = "ul";
          } else if ($_GET['Uls'] == 'us') {
               $_SESSION['uls'] = "us";
          } else if ($_GET['Uls'] == 'uu') {
               $_SESSION['uls'] = "uu";
          }
     } else {
          if (!isset($_SESSION['uls'])) {
               $_SESSION['uls'] = "uu";
          }
     }

     if (isset($_GET['Uls'])) {
          if ($_GET['Uls'] == 'ul') {
               $_SESSION['uls'] = "ul";
          } else if ($_GET['Uls'] == 'us') {
               $_SESSION['uls'] = "us";
          } else if ($_GET['Uls'] == 'uu') {
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
     //Register convert script
     wp_register_script('script', plugins_url('/wp-uighur-uls/scripts/script.js'), array(), false, true);
     wp_enqueue_script('script');
     if ($_SESSION['uls'] == "ul") {
          //Register convert script
          wp_register_script('to_uly', plugins_url('/wp-uighur-uls/scripts/to_uly.js'), array(), false, true);
          wp_enqueue_script('to_uly');
          //Register converted alphabet style
     } else if ($_SESSION['uls'] == "us") {
          //Register convert script
          wp_register_script('to_us', plugins_url('/wp-uighur-uls/scripts/to_usy.js'), array(), false, true);
          wp_enqueue_script('to_us');
          //Register converted alphabet style
     } else if ($_SESSION['uls'] == "uu") {
          //Todo: Add latin to unicode and latin to crillic
          // wp_register_script('to_uu', plugins_url('/wp-uighur-uls/scripts/to_uy.js'), array(), false, true);
          // wp_enqueue_script('to_uu');
          //Register converted alphabet style
          // wp_register_style('rtl-style', get_template_directory() . '/rtl.css');
          // wp_enqueue_style('rtl-style');
     }
}