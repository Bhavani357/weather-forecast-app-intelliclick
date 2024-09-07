import axios from 'axios';

const API_URL = 'https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/api/?disjunctive.cou_name_en&sort=name';

export const fetchCities = async (page: number) => {
  console.log(`${API_URL}&start=${page}`)
  const response = await axios.get(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${page}`);
  console.log(response)
  return response.data.results;
};
