(function () {
'use strict';

angular.module('NarrowItDownApp', [])
       .controller('NarrowItDownController', NarrowItDownController)
       .service('MenuSearchService', MenuSearchService)
       .directive('foundItems', FoundItems)
       .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com')

function FoundItems() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      foundItems: '<',
      onRemove: '&'
    },
    controller: FoundItemsController,
    controllerAs: 'list',
    bindToController: true
  };
  return ddo;
}

function FoundItemsController() {
  var list = this;

  list.nothingFound = function () {
    return list.foundItems && list.foundItems.length === 0;
  }
}



NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;

  list.getMatchedMenuItems = function(searchTerm) {
    MenuSearchService.getMatchedMenuItems(searchTerm)
      .then((items) => {
        list.found = items;
    });
  };

  list.removeItem = function(index) {
    list.found.splice(index,1);
  };
};


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: 'GET',
      url: (ApiBasePath + '/menu_items.json')
    }).then((response) => {
      if(!searchTerm) {
        return [];
      }
      var foundItems = response.data.menu_items.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return foundItems;
    });
  };
};

})();
