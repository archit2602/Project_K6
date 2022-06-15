import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Base URL for API
const BASE_URL = 'https://graphql.lottiefiles.com';

export const options = {
    stages: [
      { duration: '30s', target: 15 },
      { duration: '1m', target: 20 },
    ],
    thresholds: {
    http_req_duration: ['p(90) < 1500'],
    http_req_failed: ['rate < 0.1'],
    checks: ['rate > 0.9']
 },
  };

  export default function () {

    // End Point for GQL API
    const query = `
    mutation {
        createLoginToken {
        token  }
      }`;

      // Req Type and Headers
     let res = http.post(
         BASE_URL,
         JSON.stringify({ query: query}),
         { headers:{"Content-Type": "application/json"}}
     );

     // Assertions for API
    check(res, { 
        'status was 200': (r) => r.status == 200,
        'test validation': (r) => r.body.includes("token")
     });
    sleep(1);
  }

  // Generating summary report with Unique Name
  export function handleSummary(data) {
    let filename = 'LoginTokenSummary_' + (new Date()).toISOString() + '.json'
    let result = {}
    result[filename] = JSON.stringify(data, null, 4)
    return result
    };
