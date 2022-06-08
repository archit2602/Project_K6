import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const BASE_URL = 'https://graphql.lottiefiles.com';

export const options = {
    stages: [
      { duration: '30s', target: 10 },
      { duration: '30s', target: 15 },
    ],
    thresholds: {
    http_req_duration: ['p(90) < 1500'],
    http_req_failed: ['rate < 0.1'],
    checks: ['rate > 0.9']
 },
  };

  export default function () {
    const query = `
    {
    featuredToday{ 
      name
      id
     }
    }`;
     let res = http.post(
         BASE_URL,
         JSON.stringify({ query: query}),
         { headers:{"Content-Type": "application/json"}}
     );
    check(res, { 
        'status was 200': (r) => r.status == 200,
        'test validation': (r) => r.body.includes("name")
     });
    sleep(1);
  }
  export function handleSummary(data) {
    console.log('Finished executing performance tests');
  
    return {
      'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout...
      'summary.json': JSON.stringify(data), // and a JSON with all the details...
    };
  }
