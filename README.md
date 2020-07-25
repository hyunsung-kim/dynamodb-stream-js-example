<p align="center">
  <a href="" target="blank"><img src="river.png" width="200" height="200" alt="Civet Logo" /></a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Description

해당 예제는 DynamoDB에서 사용하는 `transactional log` 기능을 담당하는 DynamoDB Stream를 사용방법과 테스트 방법에 대한 예제를 테스트하기 위함이다.
가장 간단하게 사용할 수 있는 유즈 케이스가 사용자 가입(sign up) 시 후처리에 부분이다.

## Getting Started
테스트 프로그램의 데이터 흐름은 아래와 같이 동작한다. 가장 먼저 데이터를 REST API를 통하여 DB에 입력하고 해당 테이블에서 다이나모 스트림을 통하여 람다를 트리거한다. 람다에서는 해당 새롭게 생성한 아이템에 한하여 속성들을 찾아서 추가하여 준다.

<a href="" target="blank"><img src="event_stream_overview.png" height="400" alt="Flow Chart" /></a>


### Scaffolding Serverless project

우선 serverless template를 생성한다.

``` bash
➜ sls create --template aws-nodejs
```

### Installing plugin

npm으로 nodejs 프로젝트를 초기화 한다.

```bash
➜ npm init
```

필요한 플러그인을 설치한다. 여기서는 offline 테스트를 위하여 아래 3가지 플러그인을 설치하도록 하겠다.

```bash
➜ npm install serverless-offline
➜ npm install --save serverless-dynamodb-local
➜ npm install serverless-plugin-offline-dynamodb-stream
```

### Running Local DynamoDB

`serverless-dynamodb-local` 플러그인을 설치했다면 아래 처럼 dynamodb를 설치해서 로컬환경에서 사용할 수 있다. 

> 주의: 로컬 다이나모를 설치 후에 사용해야 함. 만약, 아래와 같은 메시지가 발생한다면 설치를 다시해줘야 함.
> ```
>   Error: spawn java ENOENT
>      at Process.ChildProcess._handle.onexit (internal/child_process.js:267:19)
>      at onErrorNT (internal/child_process.js:469:16)
>      at processTicksAndRejections (internal/process/task_queues.js:84:21)
> ```

``` bash
➜ sls dynamodb install
➜ tree .dynamodb
.dynamodb
├── DynamoDBLocal.jar
├── DynamoDBLocal_lib
...
```

이제 준비가 되었다면 로컬 다이나모를 실행시켜보자.

```bash
# 실행
➜ sls dynamodb start &

# 또는 아래와 같은 명령을 입력
➜ npm run run:local:dynamodb
Dynamodb Local Started, Visit: http://localhost:8000/shell
```

위와 같이 입력하면, `Web Shell` 이 시작된다. 화면에 아래 코드를 입력하면 테이블이 생성된다.

```javascript 
var params = {

    TableName: 'usersTable',
    KeySchema: [
        {
            AttributeName: 'email',
            KeyType: 'HASH'
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'email',
            AttributeType: 'S'
        }
    ],
    ProvisionedThroughput:  {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    StreamSpecification: {
        StreamEnabled: true,
        StreamViewType: 'NEW_AND_OLD_IMAGES'
    }

};
// console.log("The CreateTable params aren't complete yet. Continue on to the next steps of the tutorial.");
dynamodb.createTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
    console.log("CreateTable returned")

});

```

```javascript
var params = {

    TableName: 'routeTable',
    KeySchema: [
        {
            AttributeName: 'email',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'region',
            KeyType: 'RANGE'
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'email',
            AttributeType: 'S'
        },
        {
            AttributeName: 'region',
            AttributeType: 'S'
        }
    ],
    ProvisionedThroughput:  {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }

};
// console.log("The CreateTable params aren't complete yet. Continue on to the next steps of the tutorial.");
dynamodb.createTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
    console.log("CreateTable returned")

});
```

### Running server
```
➜ npm run local
```

### REST Client API
```
➜ curl -X POST http://localhost:3000/dev/users/create
-H "Content-Type: application/json"
-d "{
    "email": "test15@gamil.com",
    "pwd": 1111,
    "region": "us-east-1"
}"
```


## License

* MIT
