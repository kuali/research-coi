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

import getKnex from '../db/connection-manager';
import FeaturesDB from '../db/features-db';
import wrapAsync from '../controllers/wrap-async';

export default function renderView(viewName) {
  const reportUsage = process.env.REPORT_USAGE === 'true';
 
  return wrapAsync(async (req, res, next) => {
    let data;
    if (viewName === 'auth') {
      data = {};
    } else {
      const { schoolId, firstName, lastName, coiRole } = req.userInfo;

      const knex = getKnex(req.dbInfo);
      const featureFlags = await FeaturesDB.getFeatureFlags(knex);

      data = {
        reportUsage,
        userId: schoolId,
        firstName,
        lastName,
        coiRole,
        version: process.env.npm_package_version,
        featureFlags
      };
    }

    res.render(viewName, data, (err, html) => {
      if (err) {
        next(err);
      }

      res.send(html);
    });
  });
}
