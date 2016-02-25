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

import os from 'os';
import v8 from 'v8';

const MEGABYTE = 1048576;

export default function healthReport(req, res) {
  try {
    if (!req.query.detail) {
      return res.status(204).end();
    }

    const heapStats = v8.getHeapStatistics();
    for (const stat in heapStats) {
      heapStats[stat] = Math.round(heapStats[stat] / MEGABYTE);
    }

    const processMemory = process.memoryUsage();
    for (const stat in processMemory) {
      processMemory[stat] = Math.round(processMemory[stat] / MEGABYTE);
    }

    res.status(200).json({
      status: 'Ok',
      metrics: [
        {
          measurement: 'Total Memory on server',
          metric: 'MB',
          value: Math.round(os.totalmem() / MEGABYTE)
        },
        {
          measurement: 'Free Memory',
          metric: 'MB',
          value: Math.round(os.freemem() / MEGABYTE)
        },
        {
          measurement: 'Process Memory',
          metric: 'MB',
          value: processMemory
        },
        {
          measurement: 'Heap Statistics',
          metric: 'MB',
          value: heapStats
        },
        {
          measurement: 'Load Average',
          metric: '1, 5, and 15 minute values',
          value: os.loadavg()
        },
        {
          measurement: 'Time since last reboot',
          metric: 'seconds',
          value: os.uptime()
        }
      ]
    });
  }
  catch (err) {
    res.status(503).end();
  }
}
