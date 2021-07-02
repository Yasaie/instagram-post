window.jQuery = require('jquery');
window.$ = window.jQuery;

var Vue = require('vue/dist/vue.min');

require('cropme');
require('tinymce/tinymce');
require('tinymce/icons/default');
require('tinymce/themes/silver');
require('../plugins/tinymce/langs/fa');
var Editor = require('@tinymce/tinymce-vue').default;
var domtoimage = require('dom-to-image');

window.onload = function () {
    new Vue({
        el: "#app",
        components: {
            'editor': Editor,
        },
        data: {
            cropmeOptions: {
                container: {
                    width: '100%',
                    height: '100%'
                },
                viewport: {
                    width: '100%',
                    height: '100%',
                    border: {
                        width: 0,
                    }
                },
                zoom: {
                    enable: true,
                    mouseWheel: true,
                },
                rotation: {
                    slider: false,
                    enable: false,
                },
                transformOrigin: 'image',
            },
            tinymceOptions: {
                language: 'fa',
                placeholder: 'تیتر ...',
                menubar: false,
                height: 200,
                skin: 'oxide-dark',
                content_css: 'dark',
                textcolor_rows: 2,
                toolbar: [
                    {
                        name: 'font', items: ['fontsizeselect', 'yellowcolor']
                    },
                    {
                        name: 'align', items: ['alignright', 'aligncenter', 'alignleft', 'alignjustify']
                    },
                    {
                        name: 'history', items: ['undo', 'redo']
                    }
                ],
                fontsize_formats: "16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt 29pt 30pt",
                content_style: "body {font-size: 18pt; margin-top: 0;} p {margin: 0}",
                setup: function (editor) {
                    editor.ui.registry.addButton('yellowcolor', {
                        tooltip: 'Yellow Highlight',
                        icon: 'fill',
                        onAction() {
                            editor.execCommand('mceApplyTextcolor', "forecolor", "#ffe515");
                        }
                    });
                }
            },
            image: '',
            leadTitle: '',
            title: '',
            lineDirection: 'right',
            cropme: {},
        },
        mounted() {
            this.cropme = $('#cropme').cropme(this.cropmeOptions)
        },
        computed: {},
        methods: {
            screenShot() {
                var node = document.getElementById('container');
                var scale = 3
                domtoimage.toPng(node, {
                    height: node.offsetHeight * scale,
                    width: node.offsetWidth * scale,
                    style: {
                        transform: "scale(" + scale + ")",
                        transformOrigin: "top left",
                        width: node.offsetWidth + "px",
                        height: node.offsetHeight + "px"
                    }
                })
                    .then(function (dataUrl) {
                        var link = document.createElement('a');
                        link.download = 'image.png';
                        link.href = dataUrl;
                        link.click();
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
            },
            onFileChange(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.image = e.target.result;
                    this.cropme.cropme('bind', {url: this.image});
                };
                reader.readAsDataURL(files[0]);
            },
        }
    });
}