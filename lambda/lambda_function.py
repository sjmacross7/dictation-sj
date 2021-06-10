import json
import urllib.parse
import boto3
import datetime

print('Loading function')

s3 = boto3.client('s3')
transcribe = boto3.client('transcribe')


def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))

    try:
        # Get the object from the event and show its content type
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
        
        print(bucket)
        print(key)
        
        transcriptionJobName = datetime.datetime.now().strftime('%Y%m%d%H%M%S') + '_Transcription'
        
        result = transcribe.start_transcription_job(
            TranscriptionJobName= transcriptionJobName,
            LanguageCode='ja-JP',
            Media={
                'MediaFileUri': 'https://s3.ap-northeast-1.amazonaws.com/' + bucket + '/' + key
            },
            OutputBucketName='出力用バケット名'
        )
        
        print(result)
        
        while True:
            getJob = transcribe.get_transcription_job(
                TranscriptionJobName= transcriptionJobName,
            )
            jobStatus = getJob['TranscriptionJob']['TranscriptionJobStatus']
            print(jobStatus)
            if jobStatus == 'COMPLETED':
                break
        
        response = s3.get_object(Bucket='出力用バケット名', Key=transcriptionJobName + '.json')
        result = response['Body'].read().decode('utf-8')
        print(result)
        return {
            'isBase64Encoded': False,
            'statusCode': 200,
            'headers': {},
            'body': result
        }
    except Exception as e:
        print(e)
        # print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        # raise e
        
        return {
            'isBase64Encoded': False,
            'statusCode': 400,
            'headers': {},
            'body': '{"message": "読み込み中"}'
        }
