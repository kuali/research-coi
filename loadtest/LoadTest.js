/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import http from 'http';

export default class LoadTest {
  constructor() {
    this.CONCURRENT_REQUESTS = 25;
    this.TOTAL_REQUESTS = 4000;
    this.method = 'GET';
    this.headers = {
      'Authorization': 'Bearer a22'
    };

    this.getShortestTime = this.getShortestTime.bind(this);
    this.getAverageTime = this.getAverageTime.bind(this);
    this.getLongestTime = this.getLongestTime.bind(this);
    this.isValidResponse = this.isValidResponse.bind(this);
    this.run = this.run.bind(this);
    this.processResponse = this.processResponse.bind(this);
    this.hitEndpoint = this.hitEndpoint.bind(this);
    this.setup = this.setup.bind(this);
  }

  getShortestTime(times) {
    if (times && Array.isArray(times) && times.length > 0) {
      times.sort((a, b) => a - b);
      return times[0];
    }
    else {
      return 0;
    }
  }

  getAverageTime(times) {
    if (times && Array.isArray(times) && times.length > 0) {
      let sumOfTimes = times.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
      }, 0);

      return Math.round(sumOfTimes / times.length);
    }
    else {
      return 0;
    }
  }

  getLongestTime(times) {
    if (times && Array.isArray(times) && times.length > 0) {
      times.sort((a, b) => a - b);
      return times[times.length - 1];
    }
    else {
      return 0;
    }
  }

  isValidResponse(response) {
    return response.statusCode === 200;
  }

  setup(callback) {
    setTimeout(callback, 0);
  }

  run(port, callback) {
    this.setup(() => {
      this.times = [];
      this.completedRequests = 0;
      this.testRunnerCallback = callback;
      this.portToUse = port;
      this.overallStartTime = new Date().getTime();

      for (let i = 0; i < this.CONCURRENT_REQUESTS; i++) {
        this.hitEndpoint(this.processResponse);
      }
    });
  }

  printProgress() {
    let percent = (this.completedRequests / this.TOTAL_REQUESTS) * 100;
    process.stdout.write(`\r${Math.trunc(percent)}%`);
  }

  processResponse(err, response) {
    if (err || !this.isValidResponse(response)) {
      this.testRunnerCallback({
        success: false
      });
      return;
    }
    this.completedRequests++;
    this.times.push(response.timeElapsed);

    if (this.completedRequests % 100 === 0) {
      this.printProgress();
    }

    if (this.completedRequests === this.TOTAL_REQUESTS) {
      this.testRunnerCallback(
        {
          success: true,
          totalTime: new Date().getTime() - this.overallStartTime,
          shortestTime: this.getShortestTime(this.times),
          averageTime: this.getAverageTime(this.times),
          longestTime: this.getLongestTime(this.times)
        }
      );
    }
    else if (this.completedRequests <= this.TOTAL_REQUESTS - this.CONCURRENT_REQUESTS) {
      this.hitEndpoint(this.processResponse);
    }
  }

  getPath() {
    return this.path;
  }

  getHeaders() {
    return this.headers;
  }

  hitEndpoint(callback) {
    let options = {
      hostname: 'localhost',
      port: this.portToUse,
      path: this.getPath(),
      method: this.method,
      headers: this.getHeaders()
    };

    let startTime = new Date().getTime();

    let req = http.request(options, res => {
      let response = '';
      let statusCode = res.statusCode;

      res.setEncoding('utf8');
      res.on('data', chunk => {
        response += chunk;
      });
      res.on('end', () => {
        let timeElapsed = new Date().getTime() - startTime;
        callback(undefined, {
          statusCode,
          response,
          timeElapsed
        });
      });
    });

    req.on('error', e => {
      callback(e);
    });

    if (this.postData) {
      req.write(this.postData, 'utf8');
    }
    req.end();
  }
}