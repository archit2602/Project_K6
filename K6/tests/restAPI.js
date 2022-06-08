import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
      { duration: '5s', target: 2 },
      { duration: '10s', target: 3 },
      { duration: '20s', target: 4 },
    ],

    // thresholds: {
    //   // 90% of requests must finish within 400ms.
    //   http_req_duration: ['p(90) < 400'],
    // },
  };

  export default function () {
    const res = http.get('https://api-dev.lottiefiles.com/v2/featured');
    check(res, { 
        'status was 200': (r) => r.status == 200,
        'test validation': (r) => r.body.includes("preview")
     });
    sleep(1);
  }
