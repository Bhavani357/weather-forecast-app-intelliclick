import axios from 'axios';

const API_URL = 'https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/api/?disjunctive.cou_name_en&sort=name';

export const fetchCities = async (page: number) => {
  const response = await axios.get(`${API_URL}&start=${page}`);
  return response.data.records;
};
