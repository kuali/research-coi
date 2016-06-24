/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

/* eslint-disable no-console */

import file from 'file';
import path from 'path';
import fs from 'fs';

const config = require('./config.json');

let testsToRun;
let currentTestIndex;

const DEFAULT_PORT = config.port;

function searchDirectoryForTests(baseDirectory) {
  let testsFound = [];
  file.walkSync(baseDirectory, (dirPath, dirs, files) => {
    if (files.length > 0) {
      files = files.map(fileName => { // eslint-disable-line
        return path.join(dirPath, fileName);
      });
      testsFound = testsFound.concat(files);
    }
  });

  return testsFound;
}

function printResults(test, result) {
  if (!result.success) {
    console.error(`${test} FAILED!`);
    return;
  }

  console.log(`\rTotal time: ${result.totalTime}ms`);
  console.log(`Shortest time: ${result.shortestTime}ms`);
  console.log(`Average Time: ${result.averageTime}ms`);
  console.log(`Longest Time: ${result.longestTime}ms`);
  console.log('');
}

function startNextTest() {
  currentTestIndex++;
  if (currentTestIndex >= testsToRun.length) {
    return;
  }

  const test = testsToRun[currentTestIndex];
  const TestClass = require(test.replace('loadtest/', './')).Test;
  const theTest = new TestClass(config);
  if (theTest.disabled) {
    console.log(`${test} - DISABLED\n`);
    return startNextTest();
  }

  console.log(test);
  theTest.run(DEFAULT_PORT, results => {
    printResults(test, results);
    startNextTest();
  });
}

export default function() {
  testsToRun = [];
  currentTestIndex = -1;

  if (process.argv.length > 2) {
    const fsStats = fs.statSync(process.argv[2]);
    if (fsStats.isDirectory()) {
      testsToRun = searchDirectoryForTests(process.argv[2]);
    }
    else {
      testsToRun.push(process.argv[2]);
    }
  }
  else {
    testsToRun = searchDirectoryForTests('loadtest/tests');
  }

  if (testsToRun.length > 0) {
    startNextTest();
  }
}
