window.jQuery = require('jquery');
window.$ = window.jQuery;

var Vue = require('vue/dist/vue.min');

require('cropme');
require('tinymce/tinymce');
require('tinymce/icons/default');
require('tinymce/themes/silver');
require('../plugins/tinymce/langs/fa');
var Editor = require('@tinymce/tinymce-vue').default;
var html2canvas = require('html2canvas');

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
                fontsize_formats: "16pt 18pt 20pt 22pt 24pt 26pt 28pt 30pt",
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
                let el = this.$refs.postPrint;
                let screenShot = document.querySelector('#screen-shot');
                let screenShotImg = screenShot.appendChild(document.createElement('img'));
                const options = {
                    x: 0,
                    y: 0,
                    scrollX: 0,
                    scrollY: 0
                }
                html2canvas(el, options).then(function (canvas) {
                    el.style.display = "none";
                    // screenShot.appendChild(canvas);
                    screenShotImg.src = canvas.toDataURL()
                    screenShot.style.display = 'block';
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