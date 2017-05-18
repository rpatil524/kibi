import dbfilter from './dbfilter';
import inject from './inject';
import sirenJoin from './siren_join';

export default function (server) {

  const { set, sequence } = sirenJoin(server);

  /**
   * Transforms a search request generated by Kibi to a raw Elasticsearch search request.
   *
   * Returns an object with the following members:
   *
   * - search: the transformed search body
   * - savedQueries: a list of saved queries to be processed when transforming the response.
   *
   * @param {object} search - A search request body.
   * @return {object}
   */
  async function transformSearchRequest(search) {

    const savedQueries = await inject.save(search);
    search = await dbfilter(server.plugins.kibi_core.getQueryEngine(), search, null);
    search = await set(search);
    search = await sequence(search);

    return {
      search,
      savedQueries
    };

  }

  /**
   * Transforms an Elasticsearch response by injecting Kibi specific data in place.
   *
   * @param {object} response - An Elasticsearch response.
   * @param {object} savedQueries - The saved queries returned by transformSearchRequest.
   *
   * @return {object} the Elasticsearch response.
   */
  async function transformSearchResponse(response, savedQueries) {
    await inject.runSavedQueries({ responses: [response] }, server.plugins.kibi_core.getQueryEngine(), savedQueries);
    return response;
  }

  return {
    transformSearchRequest,
    transformSearchResponse
  };
}

