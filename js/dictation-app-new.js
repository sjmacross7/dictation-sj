var app = new Vue({
    el: '#app',
    data: {
        results: "",
        transcript: null,
        hasError: false,
        loading: true
    },
    methods: {

        putFileToS3: function() {

            var fileChooser = document.getElementById('file-chooser');

            var file = fileChooser.files[0];

            axios.put('https://h1xw38xgo2.execute-api.ap-northeast-1.amazonaws.com/gijiroku/gijiroku/put/' + file)
                .then(function(response) {
                    console.log(response);
                }.bind(this))
                .catch(function(error) {
                    console.log(error);
                    this.hasError = true;
                }.bind(this))
                .finally(function() {
                    this.loading = false;
                }.bind(this))
        }

    }
})