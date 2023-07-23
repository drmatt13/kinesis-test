const {
  GetShardIteratorCommand,
  GetRecordsCommand,
  KinesisClient,
} = require("@aws-sdk/client-kinesis");

const REGION = "us-east-1"; // Update to your region
const client = new KinesisClient({ region: REGION });

exports.lambdaHandler = async (event, context) => {
  let response;
  try {
    const paramsShard = {
      ShardId: "shardId-000000000000",
      ShardIteratorType: "TRIM_HORIZON",
      StreamName: process.env.STREAM_NAME,
    };

    const shardIteratorResponse = await client.send(
      new GetShardIteratorCommand(paramsShard)
    );

    const paramsRecords = {
      ShardIterator: shardIteratorResponse.ShardIterator,
      Limit: 10,
    };

    const records = await client.send(new GetRecordsCommand(paramsRecords));

    const recordsPayload = records.Records.map((record) => {
      return JSON.parse(Buffer.from(record.Data).toString());
    });

    response = {
      statusCode: 200,
      body: JSON.stringify(recordsPayload),
    };
  } catch (err) {
    console.error(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        error: err,
      }),
    };
  }

  return response;
};
