<?php 

if( !defined( 'ABSPATH' ) ) exit;

/**
 * Load styles
 */
function wp_components_enqueue_custom_styles() {
    wp_enqueue_style( 'styles', get_template_directory_uri() . '/style.css', array(), THEME_VERSION, 'all' );
}

add_action( 'wp_enqueue_scripts', 'wp_components_enqueue_custom_styles' ); // Add Theme Stylesheet


/**
 * Load Scripts
 */
function wp_components_enqueue_custom_scripts() {
    wp_enqueue_script( 'scripts', get_template_directory_uri() . '/js/all.min.js', array( 'jquery' ), THEME_VERSION, true );
}

add_action( 'wp_enqueue_scripts', 'wp_components_enqueue_custom_scripts' ); // Add Theme Stylesheet