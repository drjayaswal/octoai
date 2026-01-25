import { StreamClient } from '@stream-io/node-sdk';

// 1. Setup your credentials (Get these from GetStream Dashboard)
const apiKey = "4j4mkyz86mg5"
const apiSecret = "g674dtgb7tpk3bsgtfu6n6pna9a2w7y5hnn27whn5rkzbb445neup2cbhu5kdw74"
const client = new StreamClient(apiKey, apiSecret);

async function wipeAllRecordings() {
  try {
    const { calls } = await client.video.queryCalls({
      filter_conditions: {},
      limit: 100,
    });

    for (const callData of calls) {
      const call = client.video.call(callData.call.type, callData.call.id);
      const { recordings } = await call.listRecordings();

      for (const rec of recordings) {
        try {
          // The fix: Pass an object with both required properties
          await call.deleteRecording({ 
            session: rec.session_id, 
            filename: rec.filename 
          });
          
          console.log(`Deleted: ${rec.filename} from session ${rec.session_id}`);
        } catch (err: any) {
          console.error(`Error deleting ${rec.filename}:`, err.message);
        }
      }
    }
  } catch (error) {
    console.error('Cleanup script failed:', error);
  }
}

wipeAllRecordings();