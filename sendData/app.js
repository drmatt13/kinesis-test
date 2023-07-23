const { PutRecordCommand, KinesisClient } = require("@aws-sdk/client-kinesis");

const REGION = "us-east-1"; // Update to your region
const client = new KinesisClient({ region: REGION });

exports.lambdaHandler = async (event, context) => {
  let response;
  try {
    const data = JSON.stringify({ message: "Hello, world!" });
    const params = {
      Data: Buffer.from(data, "utf8"),
      PartitionKey: "1",
      StreamName: process.env.STREAM_NAME,
    };

    await client.send(new PutRecordCommand(params));

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data sent to Kinesis Stream",
      }),
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
