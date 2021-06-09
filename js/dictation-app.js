var app = new Vue({
    el: '#app',
    data: {
        results: "",
        transcript: null,
        hasError: false,
        loading: true
    },
    methods: {

        getDictationResult: function () {

            AWS.config.update({ accessKeyId: 'アクセスキー', secretAccessKey: 'シークレットアクセスキー' });
            var bucket = new AWS.S3({ params: { Bucket: 'バケット名' } });

            var fileChooser = document.getElementById('file-chooser');

            var file = fileChooser.files[0];
            if (file) {

                var params = { Key: file.name, ContentType: file.type, Body: file };
                bucket.putObject(params, function (err, data) {
                    this.results = err ? 'ERROR!' : 'UPLOADED.';
                });
            } else {
                this.results = 'Nothing to upload.';
            }

            console.log('transcriptは:' + this.transcript);


            const fetch = (executeCount = 1) => {
                console.log(`${executeCount}回目の試行です`)
                axios.get('https://h1xw38xgo2.execute-api.ap-northeast-1.amazonaws.com/gijiroku/gijiroku')
                    .then(function (response) {
                        console.log(response);
                        let responseJson = JSON.parse(response.data.body);
                        this.transcript = responseJson['results']['transcripts'][0]['transcript'];
                        if (this.transcript == null) {
                            return fetch(++executeCount);
                        }
                        console.log('transcriptは:' + this.transcript);
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                        this.hasError = true;
                        return fetch(++executeCount);
                    }.bind(this))
                    .finally(function () {
                        this.loading = false;
                    }.bind(this))
            }

            fetch().then(res => console.log(res));

        }

    }
})