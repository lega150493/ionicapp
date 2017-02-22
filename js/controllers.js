/**
 * @todo page "main": карусель доделать
 *                  http://ryan-wong.github.io/2015/05/04/ionic-generate/
 *                  http://blog.revolunet.com/angular-carousel/
 *                  https://github.com/driftyco/ionic-ion-swipe-cards
 *
 * @todo slide "menu": разворачивать подкатегории
 * @todo slide "menu": fix полоска слева (на телефоне)
 * @todo page "list": scrolling count control
 * @todo page "list": из списка удалять элементы свайпом
 * @todo page "about": certificates slider scrolling
 * @todo page "about": fix полоска вверху (на телефоне)
 * @todo page "about": fix из меню не переключаются слайды
 * @todo page "about": плавно менять бекграунды ?
 * @todo page "catalog": при раскрытии перекрывать предыдущий
 * @todo page "catalog": button-bar во всю длину
 * @todo page "contacts": кликабельные элементы
 *
 * @todo иконки параметров в списке в SVG
 * @todo check internet connection: youtube, certificates and up-to-date
 * @todo алерт загрузки данных
 * @todo список товаров сделать "подгружаемым" или добавить спинер
 *                  http://learn.ionicframework.com/formulas/infinite-lists/
 * @todo config.xml <supports-screens android:requiresSmallestWidthDp="600" /> минимальный и максимальный поддерживаемый дисплей ?
 * @todo узнать минимальное и максимальное разрешение + как детектить размер экрана
 * @todo при загрузке передавать размер дисплея
 * @todo resolve: { $content } не всем видам отдавать весь контент ?
 * @todo версия приложения для менеджеров с возможностью загрузки прайса (кнопка загрузки всего каталога в pdf (без количества и цены))
 *
 * @todo узнать есть ли возможность разобрать и собрать ionc lib с нужными компонентами ?
 * @todo ngAnimate ?
 * @todo tag <hr>: for retina set 2px ?
 * @todo reusable html ?
 * @todo copyrights in source files ?
 *
 * @todo pdf
 * @todo отдача json db + thumbs
 * @todo сохранение данных (https://www.youtube.com/watch?v=erQMOUcAdXk ?)
 * @todo выставить права, правильно собрать и протестить
 *
 * @todo question: page "contacts": оформление + имя возле почты ?
 * @todo question: page "contacts": вытягивать из инета ?
 * @todo question: page "contacts": icon fax
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @link https://www.youtube.com/user/nicraboy/playlists
 * @link http://developer.android.com/guide/practices/screens_support.html                  - Supporting Multiple Screens
 * @link https://sites.google.com/site/yourscorpion2/home/edinicy-izmerenia-v-ios-i-android
 * @link https://github.com/jmcunningham/AngularJS-Learning/blob/master/RU-RU.md
 * @link https://github.com/angular-ui/ui-router/wiki/URL-Routing
 * @link https://github.com/ionic-in-action/ionic-demo-resort-app
 * @link https://github.com/zachsoft/Ionic-Material
 * @link https://github.com/Alexintosh/Awesome-Ionic                                        - links (have jsPDF)
 * @link http://caniuse.com/#search=ttf|svg|woff|eot%20fonts
 * @link http://blog.ionic.io/automating-icons-and-splash-screens/
 * @link https://github.com/driftyco/ionic-cli#crosswalk-for-android
 * @link http://mobileangularui.com/docs/#fastclick
 * -- SVG icons:
 * @link https://icomoon.io/
 * @link https://www.google.com/design/icons/
 * @link https://github.com/google/material-design-icons
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * ldpi     (low-density)                                               0.75x
 * mdpi     (medium-density)                    ~160dpi (470x320 px)    baseline
 * hdpi     (high-density)                      ~240dpi (960x720 px)    1.5x
 * xhdpi    (extra-high-density)                ~320dpi (1920x1440 px)  2.0x
 * xxhdpi   (extra-extra-high-density)          ~480dpi
 * xxxhdpi  (extra-extra-extra-high-density)    ~640dpi
 */

angular.module('app.controllers', ['tabSlideBox'])

    .controller('AppController', function($scope, $data, $content) {
        $scope.categories = $content.categories;

        $scope.inOrderCount = function() {
            return $data.order.length;
        };
    })

    .controller('MainController', function($scope, $content) {
        $scope.videos = $content.videos;
        angular.element(document).ready(function () {
            console.log('PixelRatio: ' + window.devicePixelRatio);
        });
    })

    .controller('AboutController', function($scope, $stateParams) {
        $scope.tab = $stateParams.tab && $stateParams.tab < 5 ? parseInt($stateParams.tab) : 0;

        ionic.DomUtil.ready(function(){
            $scope.resizeSlider($scope.tab);
        });

        $scope.openCertificate = function(url) {
            if (typeof window.openFileNative !== 'undefined') {
                window.openFileNative.open(url);
            }
        };
        $scope.bgImage = function() {
            return 'img/bg-about-' + $scope.tab + '.jpg';
        };
        $scope.slideChange = function(index) {
            $scope.tab = $stateParams.tab = index;
            $scope.resizeSlider(index);
        };
        $scope.resizeSlider = function(index) {
            angular.forEach(angular.element(document.querySelector(".slider-slides")).children(), function(value){
                var elem = angular.element(value);
                elem.removeClass('hidden');
                if (elem.attr('data-index') != index) {
                    elem.addClass('hidden');
                }
            });
        };
    })

    .controller('CatalogController', function($scope, $content, $stateParams, $location, $ionicListDelegate, $ionicModal, $data, $timeout) {

        /**
         * Сбросить параметры фильтра
         */
        $scope.clearFilter = function() {
            $scope.filter.ids              = [];
            $scope.filter.categories       = [];
            $scope.filter.weightFrom       = null;
            $scope.filter.weightTo         = null;
            $scope.filter.enableCategories = false;
            $scope.filter.enableWeight     = false;
            $scope.filter.excludeAlcohol   = false;
        };

        /**
         * Добавление категории в фильтр
         * @param {number} id
         */
        $scope.filterAddCategory = function(id) {
            if (!$scope.filterHasCategory(id)) {
                $scope.filter.categories.push(id);
                $scope.filter.enableCategories = true;
            }
        };

        /**
         * Удаление категории из фильтра
         * @param {number} id
         */
        $scope.filterRemoveCategory = function(id) {
            var index = $scope.filter.categories.indexOf(id);
            if (index > -1) {
                $scope.filter.categories.splice(index, 1);
            }
        };

        /**
         *
         * @param {number} id
         * @returns {boolean}
         */
        $scope.filterHasCategory = function(id) {
            //var inFilter = false;
            //angular.forEach($scope.filter.categories, function(value) {
            //    if (value === id) {
            //        inFilter = true;
            //        return;
            //    }
            //}, inFilter);
            return ($scope.filter.categories.indexOf(id) > -1);
        };

        /**
         *
         * @param {number} id
         */
        $scope.filterToggleCategory = function(id) {
            if ($scope.filterHasCategory(id)) {
                $scope.filterRemoveCategory(id);
            } else {
                $scope.filterAddCategory(id);
            }
        };

        /**
         * Сброс фильтра по категориям
         */
        $scope.filterResetCategories = function() {
            $scope.filter.ids              = [];
            $scope.filter.categories       = [];
            $scope.filter.enableCategories = false;
        };

        /**
         * Сброс фильра по весу
         */
        $scope.filterResetWeight = function() {
            $scope.filter.weightFrom   = null;
            $scope.filter.weightTo     = null;
            $scope.filter.enableWeight = false;
        };

        var category = $stateParams.category ? parseInt($stateParams.category) : 0;
        $scope.items = $content.items;
        $scope.categories = $content.categories;
        $scope.expandedItem = null;
        $scope.lastAdded = null;
        $scope.order = $data.order;
        $scope.filter = $data.filter;
        $scope.clearFilter();
        if (category) {
            $scope.filterAddCategory(category);
        }

        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true;

        /**
         * Возвращает строку с названиями категорий в фильтре
         * @returns {string}
         */
        $scope.filterGetCategoriesNames = function() {
            var categories = [];
            if ($scope.filter.categories.length) {
                angular.forEach($scope.categories, function (item) {
                    if ($scope.filter.categories.indexOf(item.id) !== -1) {
                        categories.push(item.title);
                    }
                }, categories);
                return categories.join(', ');
            }
            return '';
        };

        /**
         *
         * @returns {string}
         */
        $scope.filterGetWeightNames = function() {
            var str = '';
            if (angular.isNumber($scope.filter.weightFrom)) {
                str += 'from ' + $scope.filter.weightFrom + ' Kg ';
            }
            if (angular.isNumber($scope.filter.weightTo)) {
                str += 'to ' + $scope.filter.weightTo + ' Kg ';
            }
            return str;
        };

        /**
         * Возвращает массив категорий с учетом параметров фильтра
         * @returns {Array}
         */
        $scope.getCategories = function() {
            return $scope.categories.filter(function(item) {
                if ($scope.filter.enableCategories && $scope.filter.categories.length) {
                    return $scope.filter.categories.indexOf(item.id) !== -1;
                }
                return true;
            });
        };

        $scope.getItems = function(id) {
            if (!angular.isArray(id)) {
                id = [id];
            }
            $scope.filter.ids = id;
            return $scope.items.filter(function (item) {
                return $scope.filter.ids.indexOf(item.id) !== -1;
            });
        };

        $scope.itemsFilter = function(item) {
            var f = true;
            if (f && $scope.filter.query.length) {
                f = (item.title.indexOf($scope.filter.query) !== -1) || (item.article.indexOf($scope.filter.query) !== -1);
            }
            if (f && $scope.filter.excludeAlcohol) {
                f = (item.alcohol === false);
            }
            return f;
        };

        $scope.categoryFilter = function(item) {
            return $scope.getItems(item.items).filter($scope.itemsFilter).length > 0;
        };

        $scope.go = function (path) {
            $location.path(path);
        };

        //$scope.show = function(id) {
        //    if ($scope.expandedItem !== id) {
        //        $scope.expandedItem = id;
        //    }
        //};

        $scope.isExpanded = function(id) {
            //console.log($scope.expandedItem, id);
            return ($scope.expandedItem === id);
        };

        $scope.toggleShow = function(id) {
            $scope.expandedItem = $scope.isShown(id) ? null : id;
        };

        $scope.expandItem = function(id, expand) {
            console.log($scope.expandedItem, id, expand);
            if ($scope.expandedItem !== id && expand) {
                $scope.expandedItem = id;
            } else if ($scope.expandedItem === id && !expand) {
                $scope.expandedItem = null;
            }
        };

        $scope.add = function (id) {
            $ionicListDelegate.closeOptionButtons();
            if ($scope.inOrder(id)) {
                angular.forEach($data.order, function(value, key) {
                    if (value.id === id) {
                        $scope.lastAdded = id;
                        $data.order[key].count += 1;
                        return;
                    }
                });
            } else {
                $data.order.push({ id: id, count: 1 });
            }
        };

        $scope.inOrder = function(id) {
            var inOrder = false;
            angular.forEach($data.order, function(value, key) {
                if (value.id === id) {
                    inOrder = true;
                    return;
                }
            }, inOrder);
            return inOrder;
        };

        $scope.inOrderCount = function() {
            return $data.order.length;
        };

        $scope.sort = function(order) {
            $scope.filter.orderBy = order;
        };

        $ionicModal.fromTemplateUrl('templates/filter.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalFilter = modal;
        });

        $ionicModal.fromTemplateUrl('templates/filter-categories.html', {
            scope: $scope,
            animation: 'no-animation'
        }).then(function(modal) {
            $scope.modalFilterCategories = modal;
        });

        $ionicModal.fromTemplateUrl('templates/search.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function(modal) {
            $scope.modalSearch = modal;
        });

        $scope.openFilter = function() {
            $scope.modalFilter.show();
        };

        $scope.closeFilter = function() {
            $scope.modalFilter.hide();
        };

        $scope.openFilterCategories = function() {
            $scope.modalFilterCategories.show();
        };

        $scope.closeFilterCategories = function() {
            $scope.modalFilterCategories.hide();
        };

        $scope.openSearch = function() {
            $scope.modalSearch.show();
            //$timeout(function () {
            //    document.querySelector('.title label').focus();
            //    if (window.cordova && window.cordova.plugins.Keyboard) {
            //        cordova.plugins.Keyboard.show();
            //    }
            //}, 300);
        };

        $scope.closeSearch = function() {
            $scope.modalSearch.hide();
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
        };

        $scope.clearSearch = function() {
            $scope.filter.query = '';
        };

        window.addEventListener('native.keyboardhide', function(e){
            $scope.modalSearch.hide();
        });

        $scope.nl2br = function( str ) {
            return str.replace(/([^>])\n/g, '$1<br/>');
        };
    })

    .controller('ListController', function($scope, $data, $content) {
        $scope.items = $content.items;
        $scope.order = $data.order;
        $scope.ids = [];

        $scope.shouldShowDelete = false;

        //window.mySwipe = new Swipe(document.getElementById('slider1'), {
        //    startSlide: 2,
        //    speed: 400,
        //    auto: 3000,
        //    continuous: true,
        //    disableScroll: false,
        //    stopPropagation: false,
        //    callback: function(index, elem) {},
        //    transitionEnd: function(index, elem) {}
        //});

        $scope.inOrder = function(id) {
            var inOrder = false;
            angular.forEach($data.order, function(value, key) {
                if (value.id === id) {
                    inOrder = true;
                    return;
                }
            }, inOrder);
            return inOrder;
        };

        $scope.getItems = function() {
            $scope.ids = [];
            angular.forEach($data.order, function(value, key) {
                $scope.ids.push(value.id);
            });
            return $scope.items.filter(function (item) {
                return $scope.ids.indexOf(item.id) !== -1;
            });
        };

        $scope.remove = function (id) {
            var index = -1;
            angular.forEach($data.order, function(value, key) {
                if (value.id === id) {
                    index = key;
                    return;
                }
            }, index);
            if (index > -1) {
                $data.order.splice(index, 1);
            }
        };

        $scope.plusItem = function(id) {
            angular.forEach($data.order, function(value) {
                if (value.id === id) {
                    value.count++;
                    return;
                }
            });
        };

        $scope.minusItem = function(id) {
            angular.forEach($data.order, function(value) {
                if (value.id === id && value.count >= 2) {
                    value.count--;
                    return;
                }
            });
        };
    })

    .factory('DataProvider', function($http, $q) {
        var data = [];
        return {
            all: function(){
                var dfd = $q.defer();
                $http.get("resource.json").then(function(response){
                    data = response.data;
                    dfd.resolve(data);
                });
                return dfd.promise;
            }
        }
    })

    .factory('$data', function() {
        var data = {
            order:  [],
            filter: {
                ids:              [],
                categories:       [],
                weightFrom:       null,
                weightTo:         null,
                enableCategories: false,
                enableWeight:     false,
                excludeAlcohol:   false,
                query:            '',
                orderBy:          'article'
            }
        };
        return data;
    });
