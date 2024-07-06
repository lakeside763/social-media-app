import request from 'supertest';
import app from '../app';

const clientRequest = async (url: string, method: string = 'get', data: any = {}) => {
  url = `/v1${url}`;

  const requestObject = request(app)[method as 'get' | 'post'](url);

  if (method === 'post') requestObject.send(data);

  return requestObject;
};

export default clientRequest;