!function(){var n={},o=[];function r(r){if(n[r])return n[r];var a=new Image;a.onload=function(){n[r]=a,t()&&o.forEach((function(n){n()}))},n[r]=!1,a.src=r}function t(){var o=!0;for(var r in n)n.hasOwnProperty(r)&&!n[r]&&(o=!1);return o}window.Resources={load:function(n){n instanceof Array?n.forEach((function(n){r(n)})):r(n)},get:function(o){return n[o]},onReady:function(n){o.push(n)},isReady:t}}();