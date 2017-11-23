import Secretin from 'secretin';
import { SecretinBrowserAdapter } from 'secretin/dist/adapters/browser';

export const Statuses = Secretin.Statuses;

export const Errors = Secretin.Errors;

const apis = new Map();

export default (server) => {
    let api = apis.get(server) || new Secretin(SecretinBrowserAdapter, Secretin.API.Server, server);
    apis.set(server, api);
    return api;
};