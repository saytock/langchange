jQuery(document).ready(function($) {
    //PC環境の場合
    if (window.matchMedia( '(max-width: 480px)' ).matches) {
        $.ajax({
            url: './css/sp/service.js',
            dataType: 'script',
            cache: false
       });
    //モバイル環境の場合
    } else {
        $.ajax({
            url: './service.js',
            dataType: 'script',
            cache: false
        });
    };
});
