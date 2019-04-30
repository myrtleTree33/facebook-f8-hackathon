import _ from 'lodash';
import removeAccents from 'remove-accents';

import City from '../models/City';
import logger from '../logger';

async function findCitiesHelper(tokens) {
  const promises = Promise.all(
    tokens.map(token => {
      const t = token.trim();
      return City.findOne({
        cityName: t
      });
    })
  );

  // remove null entries
  const cities = _.compact(await promises);

  // map field
  const cities2 = cities.map(city => {
    const { cityName } = city;
    return cityName;
  });

  const countries = cities.map(city => {
    const { countryName } = city;
    return countryName;
  });

  return { cities: cities2, countries };
}

async function findCities(query) {
  if (!query) {
    logger.warn('Empty city query.');
    return [];
  }

  const query2 = query.replace(/and/g, ',');

  let tokens = query2.split(',') || [];
  tokens = tokens.map(t => {
    return t.trim().toLowerCase();
  });

  let tokens2 = query2.split(' ') || [];
  tokens2 = tokens2.map(t => {
    return t.trim().toLowerCase();
  });

  tokens = _.union(tokens, tokens2);
  tokens = tokens.map(t => removeAccents(t));

  const { cities } = await findCitiesHelper(tokens);

  return _.uniq(cities);
}

export default {
  findCities
};
