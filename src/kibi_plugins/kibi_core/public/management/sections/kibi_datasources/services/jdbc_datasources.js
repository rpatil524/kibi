import chrome from 'ui/chrome';
import { uiModules } from 'ui/modules';
uiModules
.get('kibi_datasources/services/jdbc_datasources')
.service('jdbcDatasources', function ($http, Promise) {

  class JdbcDatasources {
    constructor() {
      this.baseUrl = chrome.getBasePath() + '/elasticsearch/_siren/connector';
    }

    get(id) {
      return $http.get(this.baseUrl + '/datasource/' + id).then(resp => resp.data);
    }

    list() {
      return $http.get(chrome.getBasePath() + '/elasticsearch/_siren/connector/datasource/_search').then(res => {
        return res.data.hits.hits;
      });
    }

    save(datasource) {
      return $http.put(this.baseUrl + '/datasource/' + datasource._id, datasource._source);
    }

    delete(id) {
      return $http.delete(this.baseUrl + '/datasource/' + id);
    }

    validate(datasource) {
      return $http.post(this.baseUrl + '/datasource/' + datasource._id + '/_validate', datasource._source).then(res => res.data);
    }

    getVirtualIndex(id) {
      return $http.get(this.baseUrl + '/index/' + id).then(res => res.data);
    }

    deleteVirtualIndex(id) {
      return $http.delete(this.baseUrl + '/index/' + id);
    }

    createVirtualIndex(index) {
      return $http.put(this.baseUrl + '/index/' + index._id, index._source).then(res => {
        if (res.status === 201) {
          return res.data;
        } else if (res.status === 200) {
          return Promise.reject(new Error('Indexpattern alrteady exist'));
        } else {
          return Promise.reject(new Error('Could not create an index pattern ' + JSON.stringify(res)));
        }
      });
    }

    listVirtualIndices() {
      return $http.get(chrome.getBasePath() + '/elasticsearch/_siren/connector/index/_search').then(res => {
        return res.data.hits.hits;
      });
    }

  }

  return new JdbcDatasources();
});
