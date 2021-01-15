# WP-Uighur-ULS
 A Wordpress plugin to convert Uyghur Arabic Alphabet to Uyghur Laten Alphabet and Uyghur Crillic Alphabet
 # uls

![alt text](https://github.com/uyghurbeg/uls/blob/master/demo.png)

A Wordpress Plugin to convert UEY to ULY/USY

Wordpress Uchun Uyghurche Yeziqlarni almashturush qisturmisi


Salam. Mezkur qisturma G.Toxti Kenji ependi teripidin yasalghan bolup, uning ruxsiti bilen, githubgha quyuldi. Kodning barliq hoquqi G.Toxti Kenji'ge mensuptur.

Ishlitish Usuli:
1. Hojjetlerni wp-content/plugins munderijige quyung
2. We yaki arqa supidin .zip hojjetni yukleng
3. We yaki arqa supidin wp-uighur-uls dep izdeng.

shuning bilen qisturma utuqluq halda qachilinidu.

4. Eger Yazma betining ustige HTML code kirguzmekchi bolsigiz, towendiki kodni uslibigizning function.php ichidiki muwapiq yerge qoyung:
```
function insert_before_post($content)
{
     if (is_single()) {
          $beforecontent = '<div class="wp-uighur-uls" style=" padding-right: 60px; padding-top: 6px;  text-transform: lowercase; !important"> <a href="?uls=us">&#1059;&#1081;&#1171;&#1091;&#1088;&#1095;&#1241;</a> | <a href="?uls=ul">&#85;&#121;&#103;&#104;&#117;&#114;&#99;&#104;&#101;</a> | <a href="?uls=uu">&#1574;&#1735;&#1610;&#1594;&#1735;&#1585;&#1670;&#1749;</a> </div>';
     } else {
          $beforecontent = '';
     }
     $fullcontent = $beforecontent . $content;

     return $fullcontent;
}
add_filter('the_content', 'insert_before_post');
```

Unumini korush:

Ortaq Turk yeziqi uchun:
www.yourdomain.xxx/?uls=ut

Uyghur Latin yeziqi uchun:
www.yourdomain.xxx/?uls=ul

Uyghur Kiril/Slawiyan yeziqi uchun:
www.yourdomain.xxx/?uls=us

Uyghur Ereb yeziqigha qaytish uchun:
www.yourdomain.xxx/?uls=uu


Misal biket:
http://www.ukij.org/ug/


2. Tillarning yeziqini ulinishqa qoshqanda towendiki buyiche qushung:

ئۇيغۇرچە

Ornek:
```
<div style="direction: ltr; float: right; padding-right: 60px; padding-top: 6px; text-transform: capitalize;"> <a href="?uls=us">&#1059;&#1081;&#1171;&#1091;&#1088;&#1095;&#1241;</a> | <a href="?uls=ul">&#85;&#121;&#103;&#104;&#117;&#114;&#99;&#104;&#101;</a> | <a href="?uls=ut">uyğurçe</a> | <a href="?uls=uu">&#1574;&#1735;&#1610;&#1594;&#1735;&#1585;&#1670;&#1749;</a> </div>
```

Mesililer:
1. Uslub adresini toghra alalmasliq;
2. Eger hojjet yaki HTML Tag'liride ereb yeziqidiki xetler bolsa toghra ulanmaydu.


